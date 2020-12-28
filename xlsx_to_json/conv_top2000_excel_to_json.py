import pandas as pd


df = pd.read_excel("./top-2000-2020.xlsx")
df.to_json("2020.json", orient ="records")

print(df.head())