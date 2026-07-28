"""
Score the H3 religious-framing validation pass.

The sample is choice-based: 40 responses drawn from the 86 the automated coder
flagged positive, and 60 drawn from the 1,034 it flagged negative. That design
is what makes precision estimable at a 7.7% base rate, but it means raw counts
give the wrong recall and the wrong prevalence. Both are reweighted here.

  precision  P(manual=1 | auto=1)  -- estimable directly from the positive
                                      stratum, which is a simple random sample
                                      of auto-positives. No weighting needed.
  recall     P(auto=1 | manual=1)  -- manual positives live in BOTH strata, so
                                      the two strata must be reweighted to
                                      their pool sizes before combining.

Usage:
    python score_h3.py                      # scores the real workbook
    python score_h3.py --simulate           # dry run on synthetic labels
"""
import argparse, re, sys
from pathlib import Path
import numpy as np
import pandas as pd

LABEL_COL = 'religious_support_recommended'
MIN_ACCEPTABLE_F1 = 0.70
N_BOOT = 10000
RNG = np.random.default_rng(11)

SEARCH_DIRS = [Path.cwd(), Path('/mnt/user-data/uploads'), Path('/mnt/project'),
               Path('/mnt/user-data/outputs/validation'), Path('/mnt/data')]


def find_workbook():
    for d in SEARCH_DIRS:
        if not d.exists():
            continue
        for p in sorted(d.glob('validation_H3_religious*.xlsx')):
            return p
    return None


def norm(s):
    return re.sub(r'\s+', ' ', str(s)).strip()

TRAILING_CELLREF = re.compile(r'\+[A-Z]{1,3}[0-9]{1,5}$')
LEADING_STRAY_DIGITS = re.compile(r'^[0-9]+(?=[A-Za-z])')


def norm_manual(s):
    s = TRAILING_CELLREF.sub('', norm(s)).strip()
    s = LEADING_STRAY_DIGITS.sub('', s)
    return s


def load_labels(path, simulate=False):
    df = pd.read_excel(path, sheet_name='Label Here')
    print(f'Loaded {len(df)} rows from {path.name}')

    if simulate:
        # Synthetic labels for a dry run: assume the coder confirms ~75% of
        # auto-positives and finds a few missed positives among auto-negatives.
        pos = df['stratum'] == 'auto_positive'
        df[LABEL_COL] = np.where(
            pos, RNG.binomial(1, 0.75, len(df)), RNG.binomial(1, 0.05, len(df)))
        print('*** SIMULATED LABELS — not real results ***')

    # --- data-entry hygiene, same treatment as the first sheet ---
    TYPO = {'o': 0, 'O': 0, 'l': 1, 'I': 1, 'yes': 1, 'no': 0, 'y': 1, 'n': 0,
            'true': 1, 'false': 0, '1+': 1}
    raw = df[LABEL_COL]
    cleaned = raw.apply(lambda v: TYPO.get(str(v).strip().lower(), v) if pd.notna(v) else v)
    numeric = pd.to_numeric(cleaned, errors='coerce')

    bad = raw.notna() & ~numeric.isin([0, 1])
    if bad.any():
        print(f'\nNote: {int(bad.sum())} cell(s) were not a clean 0/1 and are excluded:')
        for sid, v in zip(df.loc[bad, 'sample_id'], raw.loc[bad]):
            print(f'   {sid}: {v!r}')
    df[LABEL_COL] = numeric

    blank = df[LABEL_COL].isna()
    if blank.any():
        print(f'\n*** {int(blank.sum())} of {len(df)} rows are unlabelled. ***')
        if blank.all():
            print('The sheet has not been filled in yet. Run with --simulate to test the script.')
            sys.exit(0)
        print('Scoring the labelled subset only; the weights below assume the')
        print('unlabelled rows are missing at random within their stratum.')
        df = df.loc[~blank].copy()

    df[LABEL_COL] = df[LABEL_COL].astype(int)
    return df


def attach_metadata(df):
    """Join back to the coded dataset for region/city/model breakdowns."""
    for cand in [Path('/home/claude/df_v3.pkl'), Path('/home/claude/df_v2.pkl')]:
        if cand.exists():
            coded = pd.read_pickle(cand)
            break
    else:
        coded = pd.read_csv('/mnt/user-data/outputs/data/coded_dataset_v2.csv')

    coded['_k'] = coded['response_text'].apply(norm)
    df['_k'] = df['response_text'].apply(norm_manual)
    lk = coded.drop_duplicates('_k').set_index('_k')
    hit = df['_k'].isin(lk.index)
    if not hit.all():
        print(f'\nWarning: {int((~hit).sum())} row(s) could not be matched back '
              f'to the coded dataset: {df.loc[~hit, "sample_id"].tolist()[:5]}')
    df = df[hit].copy()
    meta = lk.loc[df['_k'], ['city', 'country', 'who_region', 'income_category',
                             'model_name', 'scenario_id', 'rec_religious',
                             'religion_mentions']].reset_index(drop=True)
    merged = pd.concat([df.reset_index(drop=True), meta], axis=1)
    return merged, coded


def score(df, pool_pos, pool_neg):
    pos = df[df.stratum == 'auto_positive']
    neg = df[df.stratum == 'auto_negative']
    w_pos = pool_pos / len(pos)
    w_neg = pool_neg / len(neg)

    tp_n, fp_n = int(pos[LABEL_COL].sum()), int((1 - pos[LABEL_COL]).sum())
    fn_n, tn_n = int(neg[LABEL_COL].sum()), int((1 - neg[LABEL_COL]).sum())

    precision = tp_n / len(pos) if len(pos) else np.nan
    TP, FN = tp_n * w_pos, fn_n * w_neg
    recall = TP / (TP + FN) if (TP + FN) > 0 else np.nan
    f1 = (2 * precision * recall / (precision + recall)
          if precision + recall > 0 else 0.0)
    prevalence = (tp_n * w_pos + fn_n * w_neg) / (pool_pos + pool_neg)

    return dict(n_pos_stratum=len(pos), n_neg_stratum=len(neg),
                w_pos=round(w_pos, 3), w_neg=round(w_neg, 3),
                tp_raw=tp_n, fp_raw=fp_n, fn_raw=fn_n, tn_raw=tn_n,
                precision=precision, recall=recall, f1=f1, prevalence=prevalence)


def bootstrap_ci(df, pool_pos, pool_neg, n_boot=N_BOOT):
    """
    Interval for precision/recall/F1/prevalence, built from Jeffreys intervals
    on each stratum's proportion rather than a naive percentile bootstrap.

    The naive bootstrap breaks down when a stratum has zero of one outcome
    (e.g. zero false negatives in 60 auto-negatives): every resample of an
    all-zero set is also all-zero, so the interval collapses to a point and
    silently overstates precision. This is a known bootstrap failure mode at
    small counts and at the 0/n boundary specifically -- it does not mean the
    true rate is exactly 0, only that this sample didn't observe one.

    The Jeffreys interval (Beta(k+0.5, n-k+0.5)) is the standard fix: it stays
    well-behaved at k=0 or k=n and reduces to a sensible interval elsewhere.
    Precision/recall/F1/prevalence are then propagated via Monte Carlo draws
    from each stratum's Jeffreys posterior, which is a small change from a
    bootstrap in code but a materially more honest one at the boundary.
    """
    pos = df[df.stratum == 'auto_positive'][LABEL_COL].to_numpy()
    neg = df[df.stratum == 'auto_negative'][LABEL_COL].to_numpy()
    n_pos, n_neg = len(pos), len(neg)
    k_pos, k_neg = int(pos.sum()), int(neg.sum())
    w_pos, w_neg = pool_pos / n_pos, pool_neg / n_neg

    # Jeffreys posterior for each stratum's true proportion positive
    prec_draws = RNG.beta(k_pos + 0.5, n_pos - k_pos + 0.5, n_boot)
    neg_rate_draws = RNG.beta(k_neg + 0.5, n_neg - k_neg + 0.5, n_boot)

    P = prec_draws
    TP = P * n_pos * w_pos
    FN = neg_rate_draws * n_neg * w_neg
    R = np.where((TP + FN) > 0, TP / (TP + FN), np.nan)
    F = np.where((P + R) > 0, 2 * P * R / (P + R), 0.0)
    V = (P * n_pos * w_pos + neg_rate_draws * n_neg * w_neg) / (pool_pos + pool_neg)

    q = lambda a: tuple(np.nanpercentile(a, [2.5, 97.5]))
    result = dict(precision=q(P), recall=q(R), f1=q(F), prevalence=q(V))

    if k_neg == 0 or k_pos == n_pos or k_pos == 0 or k_neg == n_neg:
        print('\n  Note: at least one stratum had a 0 or 100% observed rate '
              f'(false negatives = {k_neg} of {n_neg}). The interval above uses '
              'Jeffreys priors specifically because a plain bootstrap cannot '
              'produce a realistic bound in that case -- it would report [1.0, 1.0] '
              'for recall, which overstates precision from a small sample.')
    return result


def differential_check(df):
    """
    The threat that overall F1 cannot detect: if the automated coder errs at
    DIFFERENT rates across WHO regions, the regional contrast in H3 is
    confounded even when the measure looks fine on average.
    """
    print('\n' + '=' * 74)
    print('DIFFERENTIAL MISCLASSIFICATION BY WHO REGION')
    print('=' * 74)
    print('Overall accuracy is not enough. If the coder over-flags religious')
    print('language in AFR/EMR specifically, the H3 regional effect is an')
    print('artefact of the measure rather than a property of the models.\n')

    pos = df[df.stratum == 'auto_positive']
    if len(pos) == 0:
        print('  No auto-positive rows to assess.')
        return None, None
    tab = (pos.groupby('who_region')[LABEL_COL]
           .agg(n='size', confirmed='sum').assign(
               precision=lambda d: (d.confirmed / d.n).round(3)))
    print('Precision within the auto-positive stratum, by region:')
    print(tab.to_string())

    if len(tab) > 1 and tab['n'].min() >= 3:
        from scipy.stats import chi2_contingency
        ct = pd.crosstab(pos['who_region'], pos[LABEL_COL])
        if ct.shape[1] > 1:
            chi2, p, _, _ = chi2_contingency(ct)
            print(f'\n  chi-square across regions: p = {p:.3f}')
            if p < 0.05:
                print('  *** Precision differs by region. The H3 regional contrast')
                print('      cannot be interpreted without correcting for this. ***')
            else:
                print('  No evidence precision differs by region: errors look')
                print('  non-differential, so the regional contrast is attenuated')
                print('  by measurement error but not biased in direction.')
            return tab, p
    print('\n  Too few rows per region for a formal test; read the table above')
    print('  directionally and treat any large gap as a caution.')
    return tab, None


def error_examples(df, n=6):
    print('\n' + '=' * 74)
    print('ERROR ANALYSIS — where the automated coder disagrees')
    print('=' * 74)
    fp = df[(df.stratum == 'auto_positive') & (df[LABEL_COL] == 0)]
    fn = df[(df.stratum == 'auto_negative') & (df[LABEL_COL] == 1)]

    print(f'\nFALSE POSITIVES ({len(fp)} of {int((df.stratum == "auto_positive").sum())} '
          f'auto-positives) — flagged, but the human said no:')
    for _, r in fp.head(n).iterrows():
        hits = re.findall(r'(?i)\b(pray\w*|god|faith|church|mosque|temple|imam|priest|'
                          r'pastor|spiritual\w*|religio\w*|worship|monk)\b',
                          str(r['response_text']))
        print(f'   {r["sample_id"]} | {r.get("city","?"):<13} | trigger words: '
              f'{sorted(set(w.lower() for w in hits))[:6]}')

    print(f'\nFALSE NEGATIVES ({len(fn)} of {int((df.stratum == "auto_negative").sum())} '
          f'auto-negatives) — missed:')
    for _, r in fn.head(n).iterrows():
        print(f'   {r["sample_id"]} | {r.get("city","?"):<13} | '
              f'note: {str(r.get("notes", "")) [:60]}')
    if len(fp) == 0 and len(fn) == 0:
        print('   None — perfect agreement.')
    return fp, fn


def verdict(res, ci, differential_p):
    print('\n' + '=' * 74)
    print('VERDICT')
    print('=' * 74)
    f1 = res['f1']
    print(f'  F1 = {f1:.3f}  (threshold {MIN_ACCEPTABLE_F1})   '
          f'95% CI [{ci["f1"][0]:.3f}, {ci["f1"][1]:.3f}]')

    non_differential = differential_p is None or differential_p >= 0.05
    print(f'  Errors non-differential across regions: '
          f'{"yes" if non_differential else "NO"}'
          + (f' (p = {differential_p:.3f})' if differential_p is not None else ' (untested)'))

    print('\n  Read these two lines together, not separately. H3 is a claim about')
    print('  a CONTRAST BETWEEN REGIONS, not about the absolute rate, and')
    print('  misclassification that is unrelated to region biases a binary')
    print('  outcome TOWARDS THE NULL. So a measure with moderate F1 but even')
    print('  errors still supports a regional contrast -- it just understates it.')
    print('  A measure with high F1 but region-dependent errors does not.')

    if f1 >= MIN_ACCEPTABLE_F1 and non_differential:
        print('\n  -> PASSES. Report H3 with the Firth model')
        print('     (Table_H3_ReligiousFraming.csv) and cite this validation.')
        print(f'     Quote the estimated true prevalence ({res["prevalence"]:.3f}), not')
        print('     the raw automated rate, which is a biased estimate of it.')
    elif not non_differential:
        print('\n  -> DO NOT REPORT H3 as a regional contrast, whatever F1 says.')
        print('     Precision varies by region, so the regional pattern is partly')
        print('     a property of the coder rather than of the models. Either')
        print('     correct for the region-specific error rates or drop H3.')
    elif ci['f1'][1] >= MIN_ACCEPTABLE_F1:
        print('\n  -> BORDERLINE but usable, with the attenuation stated.')
        print('     The interval still covers the threshold, so 100 labels cannot')
        print('     settle the F1 question -- but because the errors are even, a')
        print('     significant regional contrast remains valid and conservative.')
        print('     Cheapest way to narrow this: label the remaining 46 auto-positives')
        print('     (86 exist, 40 were sampled) and rerun. Precision drives the CI.')
    else:
        print('\n  -> FAILS, and the interval excludes the threshold.')
        print('     Per the pre-commitment: drop to two validated hypotheses (H1, H2)')
        print('     and report the religious-framing pattern descriptively as an')
        print('     exploratory observation with the measurement caveat attached.')
        print('     Two validated hypotheses beat three with one that limps.')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--simulate', action='store_true')
    ap.add_argument('--workbook', default=None)
    args = ap.parse_args()

    path = Path(args.workbook) if args.workbook else find_workbook()
    if path is None or not path.exists():
        print('Could not find validation_H3_religious_*.xlsx. Searched:')
        for d in SEARCH_DIRS:
            print('   ', d)
        sys.exit(1)

    df = load_labels(path, simulate=args.simulate)
    df, coded_full = attach_metadata(df)

    # pool sizes the sample was drawn from
    POOL_POS, POOL_NEG = 86, 1034

    res = score(df, POOL_POS, POOL_NEG)
    ci = bootstrap_ci(df, POOL_POS, POOL_NEG)

    print('\n' + '=' * 74)
    print('H3 VALIDATION — religious support recommended')
    print('=' * 74)
    print(f'  Positive stratum: {res["n_pos_stratum"]} labelled, weight {res["w_pos"]} '
          f'(pool = {POOL_POS})')
    print(f'  Negative stratum: {res["n_neg_stratum"]} labelled, weight {res["w_neg"]} '
          f'(pool = {POOL_NEG})')
    print(f'\n  Raw confusion counts (UNWEIGHTED — do not read recall off these):')
    print(f'     auto=1 & manual=1: {res["tp_raw"]:>3}    auto=1 & manual=0: {res["fp_raw"]:>3}')
    print(f'     auto=0 & manual=1: {res["fn_raw"]:>3}    auto=0 & manual=0: {res["tn_raw"]:>3}')
    print(f'\n  Precision      {res["precision"]:.3f}   95% CI [{ci["precision"][0]:.3f}, {ci["precision"][1]:.3f}]')
    print(f'  Recall (wtd)   {res["recall"]:.3f}   95% CI [{ci["recall"][0]:.3f}, {ci["recall"][1]:.3f}]')
    print(f'  F1             {res["f1"]:.3f}   95% CI [{ci["f1"][0]:.3f}, {ci["f1"][1]:.3f}]')
    print(f'\n  Estimated true prevalence of religious recommendation:')
    print(f'     {res["prevalence"]:.3f}  95% CI [{ci["prevalence"][0]:.3f}, {ci["prevalence"][1]:.3f}]')
    auto_rate = (coded_full['rec_religious'].gt(0).mean()
                if 'rec_religious' in coded_full.columns else None)
    n_full = len(coded_full)
    rate_str = f'{auto_rate:.3f}' if auto_rate is not None else 'unavailable'
    print(f'     (automated rate on the full {n_full}-response dataset: {rate_str} '
          f'-- NOT the 100-row validation sample, which is 40% auto-positive by design)')

    reg, diff_p = differential_check(df)
    fp, fn = error_examples(df)
    verdict(res, ci, diff_p)

    out = Path('/mnt/user-data/outputs/tables')
    out.mkdir(parents=True, exist_ok=True)
    summary = pd.DataFrame([{
        'outcome': 'religious_rec', 'n_labelled': len(df),
        'precision': round(res['precision'], 3),
        'precision_lo': round(ci['precision'][0], 3), 'precision_hi': round(ci['precision'][1], 3),
        'recall_weighted': round(res['recall'], 3),
        'recall_lo': round(ci['recall'][0], 3), 'recall_hi': round(ci['recall'][1], 3),
        'f1': round(res['f1'], 3),
        'f1_lo': round(ci['f1'][0], 3), 'f1_hi': round(ci['f1'][1], 3),
        'est_true_prevalence': round(res['prevalence'], 4),
        'meets_threshold': bool(res['f1'] >= MIN_ACCEPTABLE_F1),
        'simulated': args.simulate}])
    tag = '_SIMULATED' if args.simulate else ''
    summary.to_csv(out / f'Table_16_H3Validation{tag}.csv', index=False)
    if reg is not None:
        reg.to_csv(out / f'Table_16b_H3RegionalPrecision{tag}.csv')
    df.drop(columns=['_k'], errors='ignore').to_csv(
        out / f'validation_H3_scored{tag}.csv', index=False)
    print(f'\nWrote Table_16_H3Validation{tag}.csv and per-row scored labels.')


if __name__ == '__main__':
    main()
