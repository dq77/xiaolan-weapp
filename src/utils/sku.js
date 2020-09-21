

// 根据已选规格拼装detail 字段
export function getSkuDetail (specMap=[]) {
  let detail = ''
  let noidDetail = ''
  for(let i = 0,len=specMap.length; i < len; i++) {
    if(specMap[i].value){
      if(i+1 === len ){
        detail += `${specMap[i].id}:${specMap[i].value.name}`
        noidDetail += `"${specMap[i].value.name}"`
      } else {
        detail += `${specMap[i].id}:${specMap[i].value.name},`
        noidDetail += `"${specMap[i].value.name}",`
      }
    }
  }
  return {
    detail,
    noidDetail
  };
}

// 根据规格详情查找对应的租期列表
export function  checkSkuStage () {
  
}