# Architecture Diagram

```
┌──────────────┐
│   Patient    │
│   Doctor     │
│   Admin      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Next.js UI   │
│ Frontend     │
└──────┬───────┘
       │ REST API
       ▼
┌──────────────┐
│ Laravel API  │
│ Backend      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   MySQL DB   │
└──────────────┘
```