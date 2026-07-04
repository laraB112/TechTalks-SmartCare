# User Flow/Workflow

## Patient User Flow

```
Start
   ↓
Regiter / Login
   ↓
Create Profile
   ↓
Enter Symptoms
   ↓
System Recommends Specialty
   ↓
View Available Doctors
   ↓
Select Doctor
   ↓
View Available Time Slots
   ↓
Book Appointment
   ↓
Receive Confirmation
   ↓
View Upcoming Appointments
   ↓
Attend Consultation
   ↓  
View Appointment History
   ↓
Logout
   ↓
End

  
  
```

## Cancel Appointment

```
Upcoming Appointments
  ↓
Select Appointment
  ↓
Cancel Appointment
  ↓
Slot Becomes Available Again
```

## Reschedule Appointment

```
Upcoming Appointments
  ↓
Select Appointment
  ↓
Reschedule
  ↓
Choose New Time Slot
  ↓
Confirmation
```

## Doctor User Flow

```
Start
  ↓
Register / Login
  ↓
Create Profile
  ↓
View Dashboard
  ↓
View Daily / Weekly Schedule
  ↓
View Patient Appointment Details
  ↓
Conduct Consultation
  ↓
Update Appointment Status
(Completed / Cancelled)
  ↓
View Upcoming Consultation
  ↓
Logout
  ↓
End
```

## Administrator User Flow

```
Start
  ↓
Login
  ↓
View Dashboard
  ↓
Manage Doctors
(Add / Edit / Delete)
  ↓
Assign Specialties
  ↓
Manage Doctor Availability
  ↓
Monitor Appointments
  ↓
Manage Users
  ↓
View Statistics
  ↓
Logout
  ↓
End
```

## Main System Workflow

```
Patient Login
  ↓
Enter Symptoms
  ↓
System Analyzes Symptoms
  ↓
Recommend Medical Specialty
  ↓
Display Matching Doctors
  ↓
Patient Selects Doctor
  ↓
Display Available Slots
  ↓
Patient Books Appointment
  ↓
System Verifies Slot Availability
  ↓
Store Appointment in Database
  ↓
Send Confirmation
  ↓
Doctor Receives Appointment
  ↓
Consultation Takes Place
  ↓
Doctor Updates Status
  ↓
Appointment Archived in History
```