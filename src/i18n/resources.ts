const resources = {
  zh: {
    translation: {
      // 定义你的中文文案
      'title':"适用于将用户的真实姓名、手机号、身份证等通过隐藏替换进行脱敏改造。根据用户选择的目标列及脱敏形式，自动替换",
      'confirmBtnText':"替换",
      'Mobile':'手机号码(185****8917)',
      'Name':'姓名(刘**/张*)',
      'IdCard':'身份证号码(410000****9417)',
      'Auto':'自动判断',
      'Desensitization method':'脱敏形式',
      'Please select the desensitization method':'请选择脱敏形式',
      'If there is a problem with the data after desensitization, please use the undo method to roll back the data (ctrl+z/⌘+z), and then select the correct desensitization method to re-desensitize it.':'如果脱敏后数据有问题，请使用撤销方式回滚数据(ctrl+z/⌘+z),然后选择正确的脱敏方式进行重新脱敏处理',
      'The function of restoring desensitized data/viewing original desensitized data with one click is under development, so stay tuned...':'一键还原脱敏数据/查看脱敏原始数据功能，正在开发中，敬请期待...',
      'Welcome to UIBuilder': '欢迎使用 UIBuilder',
      'Getting data':'获取数据中...',
      'No field type':'没有符合要求的字段类型，只能操作文本类型的字段',
      'No data':'没有敏感数据可以替换',
      'Field':'字段',
      'Insert':'插入',
      'Please select the fields to fill in':'请选择要填入的字段',
      'Begin execution':'开始执行',
      'progress':'获取数据中{{n}}/{{total}}',
      'Prepare to replace n pieces of data':'即将替换{{n}}条数据',
      'Insertion failed, please try again':'替换失败，请重试',
      'Inserted successfully':'替换成功',
      'Select the field to be inserted, and after clicking Insert, the blank record will be automatically filled with a random nickname.':'选择要插入的字段，点击插入后，会自动填充记录为随机昵称',
      'exist':'是',
      'cover':'覆盖',
      'Overwrite existing data':'是否覆盖已有数据',
    },
  },
  en: {
    translation: {
      // Define your English text
      'title':"It is suitable for desensitizing the user's real name, mobile phone number, ID card, etc. by hiding and replacing them. It is automatically generated based on the target column and desensitization method selected by the user.",
      'confirmBtnText':"Replace",
      'tip1':'If there is a problem with the data after desensitization, please use the undo method to roll back the data (ctrl+z/⌘+z), and then select the correct desensitization method to re-desensitize it.',
      'tip2':'The function of restoring desensitized data/viewing original desensitized data with one click is under development, so stay tuned...',
      'Welcome to UIBuilder': 'Welcome to UIBuilder',
      'Getting data':'Getting data...',
      'No field type':'There is no field type that meets the requirements, and only text type fields can be operated.',
      'No data':'No data to insert',
      'Prepare to replace n pieces of data':'Prepare to replace {{n}} pieces of data',
      'nicknamesource':'source',
    },
  },
};

export default resources;