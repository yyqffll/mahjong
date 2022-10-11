// 判断参数是否为空对象
function checkParam(param: Record<string, unknown> | null): boolean {
  return JSON.stringify(param) === '{}' || !param
}

// 判断数据是否存在
function checkExist(param: Record<string, unknown> | null, schema: any) {
  return new Promise((resolve, reject) => {
    if (checkParam(param)) {
      reject(new Error('参数不能为空!'))
    } else {
      schema.findOne(param).then((data: Record<string, unknown> | null) => {
        if (checkParam(data)) {
          resolve(true)
        } else {
          reject(new Error('数据已存在!'))
        }
      })
    }
  })
}

// 创建数据
function create(param: Record<string, unknown> | null, schema: any) {
  return new Promise((resolve, reject) => {
    if (checkParam(param)) {
      reject(new Error('参数不能为空!'))
    } else {
      schema.create(param).then((data: Record<string, unknown> | null) => {
        if (!checkParam(data)) {
          resolve(data)
        } else {
          reject(new Error('创建数据失败!'))
        }
      })
    }
  })
}

function findOne(param: Record<string, unknown> | null, schema: any) {
  return new Promise((resolve, reject) => {
    if (checkParam(param)) {
      reject(new Error('参数不能为空!'))
    } else {
      schema.findOne(param).then((data: Record<string, unknown> | null) => {
        if (checkParam(data)) {
          reject(new Error('未查询到数据!'))
        } else {
          resolve(data)
        }
      })
    }
  })
}

export {
  checkParam,
  checkExist,
  create,
  findOne
}
