import pandas as pd, random
from datetime import datetime, timedelta

data=[]
for i in range(500):
    data.append({
        "Date": datetime(2025,1,1)+timedelta(days=random.randint(0,180)),
        "Amount": random.randint(500,50000),
        "Category": random.choice(["Travel","Food","Software","Office"]),
        "Vendor": random.choice(["Amazon","Uber","Microsoft"]),
        "Department": random.choice(["IT","HR","Sales"]),
        "PaymentMode": random.choice(["Card","UPI"])
    })
pd.DataFrame(data).to_excel("synthetic_expenses.xlsx", index=False)
