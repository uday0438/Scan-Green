import google.generativeai as genai
genai.configure(api_key='AIzaSyBwPpTLpNuCwV_69qH1Z8UcQtfV4VJ1sOw')
with open('models_list.txt', 'w') as f:
    for m in genai.list_models():
        f.write(m.name + '\n')
