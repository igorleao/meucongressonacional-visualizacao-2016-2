import pandas as pd
import numpy as np
import json
import csv


if __name__ == "__main__":
    df = pd.read_csv('politicodw_mesano_utf8.csv', delimiter=";")
    res_df = df[['sexo', 'mesAno', 'gastoValor']].groupby([df['mesAno'], df['sexo']]).sum()

    #res.to_csv('gastos_mes_sexo.csv', sep=',', encoding='utf-8')

    json_object = json.loads(res_df.reset_index().to_json(orient='records'))
    res = []
    data_to_index = {}

    for obj in json_object:
        if obj["mesAno"] not in data_to_index:
            i = len(res)
            data_to_index[obj["mesAno"]] = i
            res.append({});
            res[i]["mesAno"] = obj["mesAno"]
        i = data_to_index[obj["mesAno"]]
        res[i][obj["sexo"]] = obj["gastoValor"]


    # write json
    #with open('gasto_mes_sexo.json', 'w') as fp:
    #    json.dump(res, fp, indent=4, sort_keys=True)

    # write csv
    #with open('gasto_mes_sexo.csv','wb') as f:
    #    w = csv.writer(f, quoting=csv.QUOTE_ALL)
    #    w.writerows(res)
