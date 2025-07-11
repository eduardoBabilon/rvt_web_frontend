import useParamFormatter from '@/hooks/useParamFormatter';
import { useMiddleware } from '@/service/middleware/useMiddleware';

export function useMCCService() {
  const { requestAxios } = useMiddleware();

  const {formatParam} = useParamFormatter();
 
  const createFrota = async (data: any) => {
    return requestAxios<void>({
      routeName: 'createFrota',
      payload: data,
      selectedApi: 'mcc'
    });
  };

  const createModelo = async (data: any) => {
    return requestAxios<void>({
      routeName: 'createModelo',
      payload: data,
      selectedApi: 'mcc'
    });
  };

  const createFamilia = async (data: any) => {
    return requestAxios<void>({
      routeName: 'createFamilia',
      payload: data,
      selectedApi: 'mcc'
    });
  };

  const createBU = async (data: any) => {
    return requestAxios<void>({
      routeName: 'createBU',
      payload: data,
      selectedApi: 'mcc'
    });
  };

  const getAllBU = async(params: any) =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllBU',
      query: formatParam(params),
      selectedApi: 'mcc'
    })
  }

  const getAllFamilia = async(param: any) =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllFamilia',
      query: formatParam(param),
      selectedApi: 'mcc'
    })
  }

  const getAllFrota = async(param: any) =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllFrota',
      query: formatParam(param),
      selectedApi: 'mcc'
    })
  }

  const getAllModelo = async(param: any) =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllModelo',
      query: formatParam(param),
      selectedApi: 'mcc'
    })
  }

  const updateFrota = async(data: any, param: any) =>{
    
    return requestAxios<void>({
      routeName: 'updateFrota',
      payload: data,
      params: param,
      selectedApi: 'mcc'
    })
  }

  const updateModelo = async(data: any, param: any) =>{
    
    return requestAxios<void>({
      routeName: 'updateModelo',
      payload: data,
      params: param,
      selectedApi: 'mcc'
    })
  }

  const updateFamilia = async(data: any, param: any) =>{
    
    return requestAxios<void>({
      routeName: 'updateFamilia',
      payload: data,
      params: param,
      selectedApi: 'mcc'
    })
  }

  const updateBU = async(data: any, param: any) =>{
    
    return requestAxios<void>({
      routeName: 'updateBU',
      payload: data,
      params: param,
      selectedApi: 'mcc'
    })
  }

  const createModeloInfoTecnica = async (data: any) => {
    return requestAxios<void>({
      routeName: 'createModeloInfoTecnica',
      payload: data,
      selectedApi: 'mcc'
    });
  };

  const createInfoTecnica = async (data: any) => {
    return requestAxios<void>({
      routeName: 'createInfoTecnica',
      payload: data,
      selectedApi: 'mcc'
    });
  };

  const getAllManyBU = async() =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllManyBU',
      selectedApi: 'mcc'
    })
  }

  const getAllManyFamilia = async() =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllManyFamilia',
      selectedApi: 'mcc'
    })
  }

  const getAllManyModelo = async() =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllManyModelo',
      selectedApi: 'mcc'
    })
  }

  const getAllInfoTecnica = async(param: any) =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllInfoTecnica',
      query: formatParam(param),
      selectedApi: 'mcc'
    })
  }

  const getAllModeloInfoTecnica = async(param: any) =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllModeloInfoTecnica',
      query: formatParam(param),
      selectedApi: 'mcc'
    })
  }

  const deleteBU = async(param: any) =>{
    
    return requestAxios<void>({
      routeName: 'deleteBu',
      params: param,
      selectedApi: 'mcc'
    })
  }

  const deleteFrota = async(param: any) =>{
    
    return requestAxios<string>({
      routeName: 'deleteFrota',
      params: param,
      selectedApi: 'mcc'
    })
  }

  const deleteFamilia = async(param: any) =>{
    
    return requestAxios<string>({
      routeName: 'deleteFamilia',
      params: param,
      selectedApi: 'mcc'
    })
  }

  const deleteModelo = async(param: any) =>{
    
    return requestAxios<string>({
      routeName: 'deleteModelo',
      params: param,
      selectedApi: 'mcc'
    })
  }

  const deleteModeloInfoTenica = async(param: any) =>{
    
    return requestAxios<void>({
      routeName: 'deleteModeloInfoTenica',
      params: param,
      selectedApi: 'mcc'
    })
  }

  const deleteInfoTenica = async(param: any) =>{
    
    return requestAxios<void>({
      routeName: 'deleteInfoTenica',
      params: param,
      selectedApi: 'mcc'
    })
  }

  const updateInfoTenica = async(data: any, param: any) =>{
    
    return requestAxios<void>({
      routeName: 'updateInfoTecnica',
      payload: data,
      params: param,
      selectedApi: 'mcc'
    })
  }

  const updateModeloInfoTenica = async(data: any, param: any) =>{
    
    return requestAxios<void>({
      routeName: 'updateModeloInfoTecnica',
      payload: data,
      params: param,
      selectedApi: 'mcc'
    })
  }

  const getAllManyInfoTecnica = async() =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllManyInfoTecnica',
      selectedApi: 'mcc'
    })
  }

  const getAllFotoModelo = async(params: any) =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllFotoModelo',
      query: formatParam(params),
      selectedApi: 'mcc'
    })
  }

  const createFotoModelo = async(payload: any) =>{
    
    return requestAxios<any[]>({
      routeName: 'createFotoModelo',
      payload: payload,
      selectedApi: 'mcc',
    })
  }

  const deleteFotoModelo = async(params: any) =>{
    
    return requestAxios<any[]>({
      routeName: 'deleteFotoModelo',
      params: params,
      selectedApi: 'mcc',
    })
  }

  const getAllCompleteFamilia = async() =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllCompleteFamilia',
      selectedApi: 'mcc'
    })
  }

  const getAllCompleteFrota = async() =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllCompleteFrota',
      selectedApi: 'mcc'
    })
  }

  const getAllCompleteModelo = async() =>{
    
    return requestAxios<any[]>({
      routeName: 'getAllCompleteModelo',
      selectedApi: 'mcc'
    })
  }

  return { 
    createFrota,  
    getAllBU, 
    createBU, 
    createFamilia, 
    createModelo, 
    createModeloInfoTecnica, 
    createInfoTecnica, 
    getAllFamilia,
    getAllFrota,
    getAllModelo,
    updateFrota,
    updateFamilia,
    updateModelo,
    updateBU,
    getAllManyBU,
    getAllManyFamilia,
    getAllManyModelo,
    getAllModeloInfoTecnica,
    getAllInfoTecnica,
    deleteBU,
    deleteFamilia,
    deleteFrota,
    deleteModelo,
    deleteInfoTenica,
    deleteModeloInfoTenica,
    updateInfoTenica,
    updateModeloInfoTenica,
    getAllManyInfoTecnica,
    getAllFotoModelo,
    createFotoModelo,
    deleteFotoModelo,
    getAllCompleteModelo,
    getAllCompleteFamilia,
    getAllCompleteFrota
  };
}
