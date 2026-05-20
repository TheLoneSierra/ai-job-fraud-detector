const scamPrompt = (text) => `
TASK: Analyze job offer for scam risk AND extract fields.

EXTRACT THESE FIELDS - return exact text from message or empty string:
- company: Company name (e.g., "Pangea", "Google", "Amazon")
- role: Job title (e.g., "Software Engineer", "Data Analyst")
- email: Email address (e.g., "hr@company.com")
- contact: Person or team name (e.g., "HR Team", "John Smith")
- location: City or address (e.g., "New York", "Bengaluru")
- joining: Date (e.g., "May 12, 2025")
- salary: Amount (e.g., "$50,000", "5 LPA")
- skills: Skills if mentioned (e.g., "Python, React")

SCAN TEXT FOR:
- "at [COMPANY]" → extract COMPANY
- "role of [TITLE]" or "as [TITLE]" → extract TITLE
- "hr@company.com" or email pattern → extract email
- "HR Team" or person name → extract contact
- Address or city name → extract location
- Date mentioned → extract joining
- "salary", "stipend", "compensation" → extract salary
- "required", "skills", "proficient" → extract skills

RISK SCORE:
- Give 0-20 if legitimate with proper details
- Give 50-70 if suspicious (urgent, vague, payment requests)
- Give 80-100 if clear scam (upfront payment, fake domain, urgency)

Return ONLY valid JSON (no markdown, no backticks).

Important extraction rules:
- extractedInfo fields must be strings.
- If the value exists in the text, copy it exactly (trim leading/trailing spaces).
- If it does not exist, use empty string "" (NOT "Not identified").
- company must be the employer company name.
- role must be the job title.
- joining must be the join/start date (e.g., "May 12th, 2025" or "May 12, 2025").

Output JSON:
{
  "riskScore": NUMBER,
  "riskLevel": "Low" | "Medium" | "High",
  "confidence": "NUMBER%",
  "summary": "Brief assessment",
  "redFlags": [{"title": "Flag name", "description": "Details"}],
  "recommendedActions": ["Action 1", "Action 2"],
  "extractedInfo": {
    "company": "",
    "role": "",
    "salary": "",
    "email": "",
    "location": "",
    "contact": "",
    "joining": "",
    "skills": ""
  }
}

TEXT TO ANALYZE:
${text}
`;

export default scamPrompt;
