# \section{Discussion}

The findings indicate that all three large language models adapted their responses according to geographic context. Across all six mental health scenarios, recommendations varied between London and Lagos, suggesting that location information influenced the generation of mental health guidance.

One of the most consistent differences involved healthcare navigation. London-based responses frequently directed users towards formal healthcare pathways, including NHS Talking Therapies, General Practitioners, and publicly funded support services. In contrast, Lagos-based responses more commonly referred users to specialist hospitals, mental health organisations, community resources, and informal support networks. These differences suggest that the models incorporate assumptions regarding local healthcare infrastructure when generating responses.

The findings also revealed variation beyond healthcare referrals. Responses generated for Lagos more frequently emphasised community support, family networks, religious organisations, and resource limitations. Conversely, London-based responses placed greater emphasis on institutional support structures and government services. This suggests that geographic context influences broader assumptions regarding social support and coping mechanisms.

## \section{Geographic Adaptation versus Geographic Bias}

An important question raised by this study is whether the observed differences represent beneficial geographic adaptation or problematic geographic bias.

On one hand, adapting recommendations to local healthcare systems may improve relevance and usefulness. Referring a user in London to NHS services or directing a user in Lagos towards local organisations may provide more actionable guidance than a generic response.

On the other hand, adaptation may become problematic if it results in unequal levels of support. Several Lagos-based responses placed greater emphasis on self-management, community support, and informal coping strategies, whereas London-based responses more frequently recommended formal healthcare services. If users in lower-resource settings consistently receive less comprehensive guidance, this could contribute to inequitable access to mental health information.

The findings, therefore, suggest that geographic adaptation and geographic bias may coexist. Adaptation can improve contextual relevance, but it may also reinforce existing inequalities if recommendations systematically differ in quality or actionability.

## \section{Differences Between Models}

Model-specific behaviour was evident throughout the dataset. GPT-4 consistently adopted a behavioural and action-oriented style, frequently providing structured coping strategies and practical advice. Gemini demonstrated the strongest localisation, often including detailed references to organisations, hospitals, helplines, and local services. Claude generally adopted a balanced approach that combined emotional validation, practical recommendations, and professional referrals.

These differences suggest that response variation cannot be explained solely by geographic context. Model architecture, training data, and design objectives may also influence how mental health guidance is generated.

## \section{Implications for AI Mental Health Support}

The findings have implications for the growing use of LLMs in mental health contexts. As users increasingly seek emotional support and health information from conversational AI systems, ensuring fairness and consistency becomes increasingly important.

Developers should consider how geographic context influences generated responses and whether adaptations result in equitable access to information. Policymakers and healthcare organisations may also need to evaluate how AI systems perform across diverse cultural and healthcare environments before they are widely deployed for mental health support.

The study further demonstrates the value of thematic analysis for evaluating AI-generated responses. Qualitative methods can reveal assumptions, contextual adaptations, and subtle forms of variation that may not be captured through quantitative metrics alone.

## \section{Limitations}

Several limitations should be acknowledged when interpreting the findings of this study.

First, the dataset was limited to six mental health prompts and two geographic locations. While the selected prompts covered a range of common mental health concerns, they cannot represent the full diversity of situations in which users may seek support from large language models.

Second, the study focused exclusively on London and Lagos. Although these locations were deliberately selected to represent different healthcare environments and socioeconomic contexts, the findings cannot be generalised to all geographic regions. Additional locations would be required to establish broader patterns of geographic variation.

Third, the analysis relied primarily on qualitative thematic analysis. While this approach provides rich insights into patterns and contextual differences, thematic interpretation involves an element of researcher judgement. Different researchers may identify or prioritise themes differently.

Finally, the study evaluated responses generated at a specific point in time. As large language models are updated regularly, future versions may produce different outputs and recommendations.

## \section{Recommendations}

Based on the findings, several recommendations can be proposed for developers, researchers, and organisations deploying AI systems for mental health support.

First, developers should increase transparency regarding how geographic context influences response generation. Users may benefit from understanding when recommendations are being adapted according to location-specific information.

Second, developers should regularly audit model outputs across diverse geographic settings to ensure that adaptations do not unintentionally reinforce existing inequalities in healthcare access or support quality.

Third, organisations using AI systems in mental health contexts should ensure that local resource recommendations are accurate, up to date, and appropriate for the user's location.

Finally, future evaluations of mental health LLMs should incorporate qualitative analysis alongside quantitative metrics to capture contextual differences that may not be apparent in automated evaluations alone.

## \section{Future Research}

This study represents an initial exploration of geographic variation in AI-generated mental health guidance. Several opportunities exist for future research.

Future studies could expand the dataset by incorporating additional cities, countries, and healthcare environments. Including a wider range of geographic contexts would allow stronger conclusions regarding global patterns of adaptation and bias.

Further research could also compare a larger number of mental health scenarios, including crises, long-term conditions, and culturally sensitive topics.

Another promising direction would be to combine thematic analysis with quantitative evaluation metrics, such as referral accuracy, response specificity, and actionability scores. This would enable a more comprehensive assessment of geographic variation.

Finally, future work could investigate how users perceive and interpret geographically adapted responses, helping to determine whether such adaptations improve user outcomes or contribute to unequal experiences.
