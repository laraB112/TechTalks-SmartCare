# Non-Functional Requirements

## **Security List**

- All users must authenticate using secure login credentials.
- Passwords must be hashed before storage.
- All communication between frontend and backend must use HTTP or HTTPS.
- Administrator must have role-based access control.
- JWT(JSON WEB TOKEN) must expire after a configurable period.

## Performance Requirements

- Login response time shall be less than 2 seconds.
- Appointment booking shall complete within 3 seconds.
- Doctor search results shall load within 5 seconds.
- The system shall support at least 500 concurrent users.
- API response time shall not exceed 1 second for normal request.

## Availability Requirements

- The system  shall be available 99.9% of the time.
- Scheduled maintenance shall be announced in advance.
- Appointment data shall be backed up daily.

## Scalability Requirements

- The system shall support future addition of hospitals and clinics.
- The architecture shall support scaling API servers horizantally.
- Database performance shall remain stable as patient records grow.

## Usability Requirements

- Users shall be able to book appointments in fewer than 5 steps.
- the interface shall be responsive on desktop, tablet, and mobile devices.
- Error messages shall clearly explain the issue and solution.
- Navigation shall remain consistent across all pages.

## Reliability Requirements

- Appointment data shall not be lost during system failures.
- The system shall recover automatically after server restarts.
- Double-booking of appointment slots shall be prevented.

## Maintainability Requirements

- Backend APIs shall follow REST standards.
- Source code shall follow agreed coding standards.
- System modules shall be documented.
- Unit tests shall cover critical business logic.

## Compatibility Requirements

- The system shall support the latest versions of Chrome, Firefox, Edge, Safari, and all operating systems.
- The system shall function on Android and IOS mobile browsers.
- The frontend shall communicate with the Laravel backend using REST APIs.

## Technology Constraints

- Frontend shall be developed using Next.js.
- Backend shall be developed using Laravel.
- Database shall use MySQL.
- Authentication shall use JWT(JSON WEB TOKEN).