# My original requirements list

1. I want to be able to send any type of expense (or income) in various formats, ex. send a picture of a recipe, send an audio where I speak describing an expense, send a video with audio, send a free hand text. All of that must be automatically identified e registered for the user
2. It must be possible to have shared accounts, the goal is that couples can look at the family expenses together, both must be able to insert expenses. Kids are also users
3. The expenses must be aggregated by category, these categories are created by the user, but some will exist for the majority of people, ex. car_expenses, house_expenses, jhon_salary etc.
4. The stack must be Supabase, React native for Android and IOs, Nexts.js for the web version (with deploy on Vercel). My provider for AI functionalities will be Open AI.
5. The system must have agentic capabilities, so take that into account when creating the development tasks
6. I want an analytics section (for visual analysis), and analytics capabilities for when interacting only in chat mode
7. I want that in chat mode I could talk and the agent talk back with me, like the conversation mode on the chat gpt app
8. The expenses recorded can be of type not realized, that is, future expenses, like credit card installments. Incomes also can be not realized. This is important because I want to have a vision of a future projection, seeing income along time, expenses along time, remaining cash along time, I want to chose between monthly, yearly, semesters etc.
9. Take special attention for money outputs directed to investment to financial independence. I want to record investment contributions as if they ware expenses. I even want to see the contributions projected into the future, so I can better plan my allocation
10. Use a TDD approach for the development

# Improved List

### **Functional Requirements**

1. **Multi-Format Expense/Income Input**

   - Users can submit expenses or incomes via:
     - **Image** (e.g., photo of a receipt)
     - **Audio** (spoken description)
     - **Video** (with audio)
     - **Free-text input**
   - The system must:
     - Automatically **extract and interpret data** from these formats using AI (OCR for images, speech-to-text for audio/video, NLP for text).
     - Validate and register the transaction for the user.

2. **Shared Accounts**

   - Support **shared accounts** for families or groups:
     - Couples can view and manage joint expenses.
     - Multiple users can insert expenses.
     - Children can have restricted accounts (e.g., view-only or limited permissions).

3. **Expense Categorization**

   - Transactions aggregated by **categories**:
     - Users can create custom categories.
     - Provide **default categories** (e.g., `car_expenses`, `house_expenses`, `salary`).
   - Allow **tagging** for more granular classification.

4. **Future Transactions**

   - Support **planned/future expenses and incomes**:
     - Examples: credit card installments, scheduled salary.
   - Enable **projection views**:
     - Monthly, quarterly, yearly, custom ranges.
     - Show **cash flow forecast** (income, expenses, remaining balance).

5. **Investment Tracking**

   - Treat **investment contributions as expenses**.
   - Include **future projections** for investments.
   - Allow filtering and visualization of **financial independence goals**.

6. **Analytics**

   - **Visual dashboards** for trends, categories, and projections.
   - **Conversational analytics**:
     - Users can query insights in chat mode (e.g., “Show me my top 3 expense categories this month”).
   - Support **voice interaction** for analytics queries.

7. **Conversational Mode**
   - Implement **voice-enabled chat**:
     - Users can speak to the agent.
     - Agent responds with voice (similar to ChatGPT’s conversation mode).
   - Maintain **contextual understanding** across sessions.

---

### **Technical Requirements**

8. **Technology Stack**

   - **Backend**: Supabase
   - **Mobile**: React Native (Android & iOS)
   - **Web**: Next.js (deploy on Vercel)
   - **AI Provider**: OpenAI for NLP, speech-to-text, and agentic capabilities.

9. **Agentic Capabilities**

   - System should:
     - Act autonomously for certain tasks (e.g., categorizing expenses, suggesting optimizations).
     - Support **goal-oriented interactions** (e.g., “Help me reduce my monthly expenses by 10%”).

10. **Test-Driven Development (TDD)**
    - All features must be developed following TDD principles.
    - Include **unit tests**, **integration tests**, and **end-to-end tests**.

---

### **Non-Functional Requirements**

11. **Security & Privacy**

    - End-to-end encryption for sensitive data.
    - Role-based access for shared accounts.
    - Compliance with relevant financial data regulations.

12. **Performance**

    - Real-time processing for voice and image inputs.
    - Fast response for analytics queries.

13. **Scalability**

    - Handle growing user base and large volumes of transactions.
    - Optimize for cloud deployment.

14. **Usability**
    - Intuitive UI for all age groups (including kids).
    - Accessibility features (voice commands, screen reader support).

---

Great addition! Here’s the updated requirement integrated into the list:

---

### **Internationalization**

15. **Language Support**
    - The application must support **English** and **Portuguese (Brazil)** for:
      - UI elements
      - Voice interactions
      - Text-based chat
      - AI-driven interpretations (e.g., OCR, speech-to-text, NLP)
    - Users can **switch languages** seamlessly in settings.
    - Ensure **locale-specific formatting** (dates, currency, decimal separators).

---

### ✅ **Additional Functional Requirements**

16. **Multi-Currency Support**

- Allow users to record expenses/incomes in different currencies.
- Provide automatic or manual currency conversion based on real-time exchange rates.

17. **Recurring Transactions**

- Enable scheduling of recurring expenses/incomes (e.g., rent, subscriptions).
- Allow users to edit or cancel recurring entries easily.

18. **Notifications & Reminders**

- Push notifications for:
  - Upcoming bills or planned expenses.
  - Budget threshold alerts.
  - Investment contribution reminders.

19. **Budgeting Features**

- Users can set **monthly or yearly budgets** per category.
- System warns when nearing or exceeding limits.

20. **Offline Mode**

- Basic functionality available offline (e.g., adding expenses).
- Sync when back online.

21. **Export & Import**

- Export data to **CSV, Excel, or PDF**.
- Import historical data from other apps or bank statements.

22. **Bank Integration (Optional Future Feature)**

- Connect to bank APIs for automatic transaction import.
- Ensure compliance with **Open Banking standards**.

---

### ✅ **Additional Technical & Best Practices**

23. **Internationalization & Localization**

- Already added English and Portuguese (Brazil).
- Ensure **currency, date, and number formats** adapt to locale.

24. **Accessibility**

- WCAG compliance for web and mobile.
- Voice commands and screen reader support.

25. **Error Handling & Logging**

- Implement robust error handling for AI processing failures.
- Centralized logging for debugging and monitoring.

26. **Data Backup & Recovery**

- Automatic backups for user data.
- Disaster recovery plan for Supabase database.

27. **Performance Monitoring**

- Use tools like **Vercel Analytics** and **Supabase monitoring**.
- Track latency for AI calls and optimize caching.

28. **Privacy & Compliance**

- GDPR and LGPD compliance for handling personal and financial data.
- Clear privacy policy and consent management.

29. **Scalable Architecture**

- Modular design for adding new AI features.
- Consider **serverless functions** for cost efficiency.

30. **CI/CD Pipeline**

- Automated testing and deployment.
- Integration with GitHub Actions or similar.

31. **Observability**

- Implement metrics, tracing, and alerting for production health.

---

### ✅ **Agentic Capabilities Enhancements**

32. **Proactive Suggestions**

- Agent suggests:
  - Budget optimizations.
  - Investment strategies based on goals.
  - Alerts for unusual spending patterns.

33. **Goal Tracking**

- Users can set financial goals (e.g., “Save \$10,000 by next year”).
- Agent monitors progress and provides recommendations.

---
