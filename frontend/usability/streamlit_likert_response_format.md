# Streamlit Likert Questionnaire Response Format

This file defines the response format for a Streamlit-based UTAUT Likert questionnaire.

## Columns

- `participant_id`: unique participant identifier (e.g. `P01`).
- `role`: participant role, such as `client` or `seller`.
- `PE1`: Performance Expectancy 1 — "Using UniServ improves my productivity when hiring/offering services."
- `PE2`: Performance Expectancy 2 — "UniServ is useful for completing my work/tasks."
- `EE1`: Effort Expectancy 1 — "Learning to use UniServ is easy for me."
- `EE2`: Effort Expectancy 2 — "It is easy to become skillful at using UniServ."
- `SI1`: Social Influence 1 — "People who influence my behavior think I should use UniServ."
- `SI2`: Social Influence 2 — "My peers would recommend UniServ to others."
- `FC1`: Facilitating Conditions 1 — "I have the resources (device, internet) to use UniServ."
- `FC2`: Facilitating Conditions 2 — "Support documentation or help is available when I need it."
- `BI1`: Behavioral Intention 1 — "I intend to continue using UniServ in the near future."
- `BI2`: Behavioral Intention 2 — "I will recommend UniServ to others."
- `comments`: optional open-ended participant feedback.

## Response values

Use either the text labels or numeric mapping:

- `Strongly Disagree` = `1`
- `Disagree` = `2`
- `Somewhat Disagree` = `3`
- `Neutral` = `4`
- `Somewhat Agree` = `5`
- `Agree` = `6`
- `Strongly Agree` = `7`

## Example row

```csv
participant_id,role,PE1,PE2,EE1,EE2,SI1,SI2,FC1,FC2,BI1,BI2,comments
P01,client,Strongly Agree,Agree,Agree,Agree,Somewhat Agree,Agree,Agree,Agree,Agree,Agree,"Smooth overall, image upload slightly slow"
```

## Streamlit data model

A typical Streamlit form would collect the responses as a single row per participant. For analysis, store the responses in a pandas DataFrame or CSV file.

### Sample pandas schema

```python
import pandas as pd

columns = [
    'participant_id',
    'role',
    'PE1',
    'PE2',
    'EE1',
    'EE2',
    'SI1',
    'SI2',
    'FC1',
    'FC2',
    'BI1',
    'BI2',
    'comments',
]

responses_df = pd.DataFrame(columns=columns)
```

## Notes

- If you prefer numeric analysis, store both label and numeric columns or map labels to values on load.
- `comments` can remain free text for qualitative analysis.
- This format is compatible with both CSV export and database storage.
