export default function useParamFormatter() {
    const formatParam = (data: any) => {
        const queryParams = new URLSearchParams();

        for (const key in data) {
            queryParams.append(key, String(data[key])); // Converte para string para evitar erros
        }

        const formatedParams = Object.fromEntries(queryParams.entries());

        const finalList = formatedParams
            ? Object.entries(formatedParams).map(([key, value]) => {
                  try {
                      return { [key]: JSON.parse(value) }; // Só faz parse se for JSON
                  } catch {
                      return { [key]: value }; // Retorna o valor normal se não for JSON
                  }
              })
            : undefined;

        return finalList;
    };

    return { formatParam };
}
