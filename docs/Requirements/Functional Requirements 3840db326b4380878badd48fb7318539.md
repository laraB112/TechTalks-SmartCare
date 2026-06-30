# Functional Requirements

## **Patient Functional Requirements:**

- The system shall allow patients to register and log in securely
- The system shall allow patients to create and manage their profile
- The system shall allow patients to enter and submit symptoms
- The system shall provide an automated specialty recommendation based on symptoms
- The system shall display available doctors based on the recommended specialty
- The system shall allow patients to view available appointment slots
- The system shall allow patients to book an appointment with a doctor
- The system shall allow patients to cancel or reschedule appointments
- The system shall allow patients to view appointment history and upcoming appointments

## Doctor Functional Requirements

- The system shall allow doctors to log in securely
- The system shall allow doctors to view daily and weekly schedules
- The system shall allow doctors to view patient appointment details
- The system shall allow doctors to update appointment status (completed, pending, canceled)
- The system shall allow doctors to view upcoming consultations

## Administrator Functional Requirements

- The system shall allow administrators to add, edit, and remove doctors
- The system shall allow administrators to assign specialties to doctors
- The system shall allow administrators to manage doctor availability
- The system shall allow administrators to monitor all appointments
- The system shall allow administrators to view system statistics
- The system shall allow administrators to manage system users

## System Functional Requirements

- The system shall analyze symptoms and recommend medical specialties
- The system shall match patients with available doctors based on specialty and schedule
- The system shall manage real-time appointment slot availability
- The system shall store and retrieve all hospital data securely
- The system shall support communication between Next.js frontend and Laravel backend via REST API
- The system shall ensure data consistency across all modules