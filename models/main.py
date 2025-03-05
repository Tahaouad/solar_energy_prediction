import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression, Lasso, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib


#Load the dataset that will be used for training the model.
plant1_gen = pd.read_csv('./Data/Plant_1_Generation_Data.csv')
plant1_weather = pd.read_csv('./Data/Plant_1_Weather_Sensor_Data.csv')

print(plant1_gen.head())
print(plant1_weather.head())

#convert the date column (string) to datetime format 
plant1_gen['DATE_TIME'] = pd.to_datetime(plant1_gen['DATE_TIME'], format='%d-%m-%Y %H:%M')
plant1_weather['DATE_TIME'] = pd.to_datetime(plant1_weather['DATE_TIME'], format='%Y-%m-%d %H:%M:%S')

# Exploring the data
print(plant1_gen.info())
print(plant1_weather.describe())

# first perspective "visualisation"
# plt.figure(figsize=(12,6))
# plant1_gen.groupby(plant1_gen['DATE_TIME'].dt.date)['DAILY_YIELD'].mean().plot()
# plt.title('Daily Yield Over Time')
# plt.show()

# Data Preprocessing
plant1_gen_agg = plant1_gen.groupby('DATE_TIME').agg({
    'AC_POWER': 'sum',
    'DC_POWER': 'sum',
    'DAILY_YIELD': 'mean'
}).reset_index()

scaler = MinMaxScaler()
columns_to_normalize = ['DC_POWER', 'DAILY_YIELD']
plant1_gen_agg[columns_to_normalize] = scaler.fit_transform(plant1_gen_agg[columns_to_normalize])
plant1_gen_agg.describe()

# Weather conditions directly impact solar output, so merging datasets connects cause (weather) and effect (power)
merged_data = pd.merge(plant1_gen_agg, plant1_weather, on='DATE_TIME')

#Handling Missing Values
merged_data = merged_data.fillna(method='ffill')

#More filtering/engineering on each feature
merged_data['HOUR'] = merged_data['DATE_TIME'].dt.hour
merged_data['DAY_OF_WEEK'] = merged_data['DATE_TIME'].dt.dayofweek
merged_data['MONTH'] = merged_data['DATE_TIME'].dt.month

# Split Data
features = ['AMBIENT_TEMPERATURE', 'MODULE_TEMPERATURE', 'IRRADIATION',
           'HOUR', 'DAY_OF_WEEK', 'MONTH']
target = 'AC_POWER'

#Distribution of features
# for feature in features:
#     plt.figure(figsize=(10, 6))
#     sns.histplot(merged_data[feature], kde=True)
#     plt.title(f'Distribution of {feature}')
#     plt.show()


corr_matrix = merged_data.select_dtypes(include=['number']).corr()

sns.heatmap(corr_matrix[['AC_POWER']], annot=True)
plt.title('Correlation Matrix')
plt.show()

# Train Model
# Split data into training (before June 15) and testing (after June 15) sets

split_date = '2020-06-15'
train = merged_data[merged_data['DATE_TIME'] < split_date]
test = merged_data[merged_data['DATE_TIME'] >= split_date]

X_train = train[features]
y_train = train[target]
X_test = test[features]
y_test = test[target]

#Model Building

models = {
    "Linear Regression": LinearRegression(),
    "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
    "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=5),
    "XGBoost": XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5),
    "Lasso": Lasso(alpha=0.1),
    "Ridge": Ridge(alpha=1.0),
    "SVR": SVR(kernel='rbf', C=500, gamma=0.01, epsilon=10)
}

results = []

for name, model in models.items():
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    results.append({"Model": name, "MAE": mae, "R² Score": r2})

results_df = pd.DataFrame(results)
print(results_df)

svr_model = models['SVR']
svr_predictions = svr_model.predict(X_test)


#Visualizing the Predictions vs Actuals for the SVR Model 
plt.figure(figsize=(10,6))
plt.plot(y_test.values[:100], label='Actual', linestyle='dashed', marker='o')
plt.plot(svr_predictions[:100], label='Predicted', linestyle='solid', marker='x')
plt.legend()
plt.xlabel("Échantillons")
plt.ylabel("AC Power")
plt.title("Actual vs Predicted AC Power (SVR)")
plt.show()


joblib.dump(svr_model, 'svr_model.pkl')