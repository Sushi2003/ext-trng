export const promptIsInitialReachout = emailText => `Please analyze the provided email and determine if it is an initial outreach from a recruiter for a job opportunity. Extract the information and return it in JSON format with the following schema:
{
  "is_initial_outreach": boolean,
  "position_title": string,
  "locations": [string],
  "duration": string,
  "visa_requirements": [string],
  "job_description": {
    "total_experience_years": number,
    "technical_skills": [string],
    "frameworks_tools_experience": [string]
  },
  "company_name": string,
  "contact_information": {
    "contact_name": string,
    "job_title": string,
    "desk_phone": string,
    "direct_phone": string,
    "email": string
  },
  "additional_requirements": string
}
Here is the email content:
---
${emailText}
`