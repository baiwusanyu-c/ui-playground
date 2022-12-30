# 公共方法

## getPlayPreset
获取预设配置方法，你可以在此预设的基础上设置 `playground` 的配置，目前只支持 `vue`。
```typescript
declare function getPlayPreset(type: presetTypes): playConfig
```

## utoa
转码，用于将虚拟文件的代码等信息转化为 `base46`，并挂在哈希地址上
```typescript
declare function utoa(data: string): string
```

## atou
解码 用于将挂在哈希地址上转化为虚拟文件信息、代码等，来实现持久化
```typescript
declare function atou(base64: string): string
```

## deserialize
内部调用`atou` 方法并格式化其结果，将其转化为 `js` 对象
```typescript
declare function deserialize(text: string): Record<string, any>
```

## serialize
内部调用`utoa` 方法并序列化其结果，将其转化为字符串
```typescript
declare function serialize(
  mainFile: string, 
  importMap: Array<importItem>, 
  files: Record<string, any>, 
  isProdCompile: boolean, 
  isSSRCompile: boolean): string
```

## extend
对象浅拷贝继承
```typescript
const extend: <
  T extends Record<string, any>, 
  U extends Record<string, any>
  >(objFir: T, objSec: U) => T & U
```

## checkFileType
用于检查虚拟文件名后缀
```typescript
const checkFileType: (filename: string) => boolean
```