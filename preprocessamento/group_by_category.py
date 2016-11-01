import pandas as pd
import numpy as np
import json
import csv
from collections import Counter


if __name__ == "__main__":
    df = pd.read_csv('politicodw_mesano_utf8.csv', delimiter=";")
    res_df = df[['gastoTipo', 'mesAno', 'gastoValor']].groupby([df['mesAno'], df['gastoTipo']]).sum()
    most_common_by_frequencies = Counter(df["gastoTipo"]).most_common(5)
    most_common_categories = list(map(lambda x: x[0], most_common_by_frequencies))

    json_object = json.loads(res_df.reset_index().to_json(orient='records', force_ascii=False))
    res = []
    data_to_index = {}

    for obj in json_object:
        if obj["mesAno"] not in data_to_index:
            i = len(res)
            data_to_index[obj["mesAno"]] = i
            res.append({});
            res[i]["mesAno"] = obj["mesAno"]
        i = data_to_index[obj["mesAno"]]
        if obj["gastoTipo"] in most_common_categories:
            if obj["gastoTipo"] not in res[i]:
                res[i][obj["gastoTipo"]] = 0
            res[i][obj["gastoTipo"]] += obj["gastoValor"]
            #res[i][obj["sexo"]] = obj["gastoValor"]

    #print();
    #print(df.groupby(["gastoTipo"]).agg(lambda x:x.value_counts().index[0]))
    # write json
    print(res);
    with open('gasto_tipo.json', 'w', encoding='utf8') as fp:
        json.dump(res, fp, indent=4, sort_keys=True, ensure_ascii=False)

    # write csv
    #with open('gasto_mes_sexo.csv','wb') as f:
    #    w = csv.writer(f, quoting=csv.QUOTE_ALL)
    #    w.writerows(res)
