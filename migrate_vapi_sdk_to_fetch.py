import sys
import re
import os

# Usage: python migrate_vapi_sdk_to_fetch.py chemin/vers/index.ts
if len(sys.argv) != 2:
    print("Usage: python migrate_vapi_sdk_to_fetch.py chemin/vers/index.ts")
    sys.exit(1)

file_path = sys.argv[1]
if not os.path.isfile(file_path):
    print(f"Fichier non trouvé: {file_path}")
    sys.exit(1)

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Supprimer l'import du SDK Vapi
def remove_vapi_sdk_imports(code):
    code = re.sub(r"// @deno-types=.*?@vapi-ai/server-sdk.*?\n", "", code)
    code = re.sub(r"import \{.*?VapiClient.*?\} from 'https://esm.sh/@vapi-ai/server-sdk.*?'\n", "", code)
    return code

# Ajouter la fonction utilitaire callVapiAPI si absente
def inject_call_vapi_api(code):
    if "function callVapiAPI" in code:
        return code
    call_vapi_api_code = '''
async function callVapiAPI(endpoint, apiKey, method = 'GET', body) {
    const url = `https://api.vapi.ai${endpoint}`;
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    const responseText = await response.text();
    if (!response.ok) {
        let errorData;
        try { errorData = JSON.parse(responseText); }
        catch { errorData = { raw_error: responseText }; }
        throw new Error(errorData.message || errorData.raw_error || `API request failed with status ${response.status}`);
    }
    return JSON.parse(responseText);
}
'''
    return call_vapi_api_code + "\n" + code

# Remplacer les appels au SDK Vapi par callVapiAPI (simplifié, à ajuster manuellement si besoin)
def replace_vapi_client_calls(code):
    # Exemples : vapiClient.knowledgeBases.list() => await callVapiAPI('/knowledge-base', vapiApiKey, 'GET')
    code = re.sub(r"vapiClient\.(\w+)\.(list|retrieve|get)\((.*?)\)", r"await callVapiAPI('/\1', vapiApiKey, 'GET')", code)
    code = re.sub(r"vapiClient\.(\w+)\.(create)\((.*?)\)", r"await callVapiAPI('/\1', vapiApiKey, 'POST', \3)", code)
    code = re.sub(r"vapiClient\.(\w+)\.(update)\((.*?), (.*?)\)", r"await callVapiAPI('/\1/' + \2, vapiApiKey, 'PATCH', \3)", code)
    code = re.sub(r"vapiClient\.(\w+)\.(delete)\((.*?)\)", r"await callVapiAPI('/\1/' + \2, vapiApiKey, 'DELETE')", code)
    return code

content = remove_vapi_sdk_imports(content)
content = inject_call_vapi_api(content)
content = replace_vapi_client_calls(content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Migration automatique terminée pour : {file_path}\nVérifiez et ajustez manuellement si besoin.") 