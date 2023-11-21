import {
  bitable,
  FieldType,
  IField,
  ITable,
  UIBuilder,
} from '@lark-base-open/js-sdk';
import { UseTranslationResponse } from 'react-i18next';
import i18n from './i18n';
export default async function (
  uiBuilder: UIBuilder,
  { t }: UseTranslationResponse<'translation', undefined>
) {
  uiBuilder.showLoading(t('Getting data'));
  console.time('initData');
  const { options, table, fieldList, methodOptions } = await initData({ t });
  console.timeEnd('initData');
  if (options.length === 0) {
    uiBuilder.hideLoading();
    uiBuilder.text(t('No field type'));
    return;
  }
  uiBuilder.markdown(`## ${t('title')}`);
  uiBuilder.markdown(`###### ${t('desc')}`);
  uiBuilder.form(
    (form) => {
      const formItems: any = [
        form.select('field', {
          label: t('Field'),
          options: options,
          defaultValue: options[0].value,
        }),
        form.select('method', {
          label: t('Desensitization method'),
          options: methodOptions,
          multiple: true,
          defaultValue: methodOptions[0].value,
        }),
      ];
      return {
        formItems,
        buttons: [t('confirmBtnText')],
      };
    },
    async ({ values }) => {
      const { field, method } = values;
      const tb = table as ITable;
      const f = field as string;
      const m = method as string[];
      if (!m || m.length === 0) {
        uiBuilder.message.error(t('Please select the desensitization method'));
        return;
      }
      // const isOverwrite = overwrite && (overwrite as any).length > 0;
      // const isPrefix = prefix && (prefix as any).length > 0;
      // const isWeaponry = weaponry && (weaponry as any).length > 0;
      const fd = fieldList.find((item) => item.id === f) as IField;
      if (!fd) {
        uiBuilder.message.error(t('Please select the fields to fill in'));
        return;
      }
      uiBuilder.showLoading(t('Begin execution'));
      const recordIdList = await tb.getRecordIdList();

      //构建替换数据
      const toSetTask = [];
      const recordList = await table.getRecordList();
      for (const record of recordList) {
        const cell = await record.getCellByField(f);
        const val = await cell.getValue();
        const realVal = val?.[0].text;
        console.log('一键脱敏数据', realVal);
        if (realVal) {
          toSetTask.push({
            recordId: record.id,
            fields: {
              [fd.id]: dataToEncrypt(realVal, { method: m }),
            },
          });
        }
      }
      if (toSetTask.length === 0) {
        uiBuilder.hideLoading();
        uiBuilder.message.warning(t('No data'));
        return;
      }
      uiBuilder.showLoading(
        t('About to insert n random nicknames', { n: toSetTask.length })
      );
      const step = 5000;
      let hasError = false;
      for (let index = 0; index < toSetTask.length; index += step) {
        const element = toSetTask.slice(index, index + step);
        await tb
          .setRecords(element)
          .then(() => {
            // console.log('执行完成');
          })
          .catch((e) => {
            hasError = true;
            console.log(e);
          });
      }
      uiBuilder.hideLoading();
      if (hasError) {
        uiBuilder.message.error(t('Insertion failed, please try again'));
      } else {
        uiBuilder.message.success(t('Inserted successfully'));
      }
    }
  );
  uiBuilder.markdown('###### 如果脱敏后数据有问题，请使用撤销方式回滚数据(ctrl+z/⌘+z),然后选择正确的脱敏方式进行重新脱敏处理');
  uiBuilder.markdown(`###### 一键还原脱敏数据/查看脱敏原始数据功能，正在开发中，敬请期待...`);
  uiBuilder.hideLoading();
}

const initData = async ({ t }: any) => {
  console.log('initData - start');
  console.time('getActiveTable');
  const aT = await bitable.base.getActiveTable();
  console.timeEnd('getActiveTable');
  console.time('getFieldMetaListByType');
  const fieldMetaList = await aT.getFieldMetaListByType(FieldType.Text);
  console.timeEnd('getFieldMetaListByType');
  console.time('getFieldListByType');
  const fieldList = await aT.getFieldListByType(FieldType.Text);
  console.timeEnd('getFieldListByType');
  console.time('options');
  const options = fieldMetaList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  console.timeEnd('options');
  const lang = isCN() ? 'zh' : 'en';
  return {
    options,
    table: aT,
    fieldList,
    methodOptions: [
      {
        label: t('all'),
        value: 'all',
      },
      {
        label: t('mobile'),
        value: 'mobile',
      },
      {
        label: t('name'),
        value: 'name',
      },
      {
        label: t('idCard'),
        value: 'idCard',
      },
    ],
  };
};

const isCN = () => {
  return i18n.language === 'zh';
};

//TODO：混合数据脱敏
const dataToEncrypt = (
  data: string,
  options?: {
    method: string[];
  }
) => {
  if (!data) {
    return '';
  }
  log('脱敏方式', options);
  const isAll = options?.method.includes('all');
  let result = data;
  if (options?.method.includes('idCard') || isAll) {
    result = converIdCard(result);
  }
  if (options?.method.includes('mobile') || isAll) {
    result = convertMobile(result);
  }
  if (options?.method.includes('name') || isAll) {
    result = convertName(result);
  }
  log('脱敏结果', data, result);
  return result;
};

const convertMobile = (str: string) => {
  const regex = /1[3-9]\d{9}/g;
  return str.replace(regex, function (match) {
    return match.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  });
};

const converIdCard = (str: string) => {
  // 正则表达式匹配18位身份证号码
  var idCardRegex = /\b\d{6}\d{8}\d{3}[\dX]\b/g;
  // 替换中间10位为星号，进行脱敏
  return str.replace(idCardRegex, function (match) {
    return match.substring(0, 6) + '****' + match.substring(14, 18);
  });
};

const convertName = (text: string) => {
  // 使用正则表达式匹配中文字符
  const namePattern = /[\u4e00-\u9fa5]{2,}/g;
  return text.replace(namePattern, (match) => {
    // 保留姓氏（第一个字），其余字用星号替换
    let desensitized = match.charAt(0);
    if (match.length > 2) {
      // 如果姓名长度超过两个字，则判断是否为复姓
      const compoundSurname = [
        '欧阳',
        '司马',
        '上官',
        '端木',
        '诸葛',
        '东方',
        '独孤',
        '南宫',
        '万俟',
        '闻人',
        '夏侯',
        '皇甫',
        '尉迟',
        '公羊',
        '澹台',
        '公冶',
        '宗政',
        '濮阳',
        '淳于',
        '单于',
        '太叔',
        '申屠',
        '公孙',
        '仲孙',
        '轩辕',
        '令狐',
        '钟离',
        '宇文',
        '长孙',
        '慕容',
        '鲜于',
        '闾丘',
        '司徒',
        '司空',
        '丌官',
        '司寇',
        '仉督',
        '子车',
        '颛孙',
        '端木',
        '巫马',
        '公西',
        '漆雕',
        '乐正',
        '壤驷',
        '公良',
        '拓跋',
        '夹谷',
        '宰父',
        '谷梁',
        '晋楚',
        '阎法',
        '汝鄢',
        '涂钦',
        '段干',
        '百里',
        '东郭',
        '南门',
        '呼延',
        '归海',
        '羊舌',
        '微生',
        '岳帅',
        '缑亢',
        '况后',
        '有琴',
        '梁丘',
        '左丘',
        '东门',
        '西门',
        '商牟',
        '佘佴',
        '伯赏',
        '南宫',
        '墨哈',
        '谯笪',
        '年爱',
        '阳佟',
      ];
      let surname = match.substring(0, 2);
      if (compoundSurname.includes(surname)) {
        // 如果是复姓，保留复姓
        desensitized += match.charAt(1);
      }
    }
    return desensitized + '*'.repeat(match.length - desensitized.length);
  });
};

const log = (...other: any) => {
  console.log(...other);
};
