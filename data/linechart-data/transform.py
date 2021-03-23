import pandas as pd

readings_csv = pd.read_csv('Boonsong Lekagul waterways readings.csv', encoding='unicode_escape')
chemical_csv = pd.read_csv('chemical units of measure.csv', encoding='unicode_escape')
measures = chemical_csv['measure']

# i = 0
min = dict()
max = dict()

for single in measures:
    # if i==104:
    #     temp = readings_csv.loc[readings_csv['measure'] == single]
    #     max_measure = temp['value'].max()
    #     min_measure = temp['value'].min()
    #     print(temp)
    #     print(max_measure)
    #     print(min_measure)
    #     break
    # i += 1
    temp = readings_csv.loc[readings_csv['measure'] == single]
    min[single] = temp['value'].min()
    max[single] = temp['value'].max()
    # print(max_measure)
    # print(min_measure)

print(min)
print(max)
print(len(max))
print(len(max))
chemical_csv['min'] = chemical_csv['measure'].map(min)
chemical_csv['max'] = chemical_csv['measure'].map(max)
print(readings_csv)
chemical_csv.to_csv("chemical_units_min_max.csv", index=False, encoding='utf-8')
