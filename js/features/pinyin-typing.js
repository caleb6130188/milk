/**
 * 拼音打字功能
 * 梦角回复时，随机决定走「拼音打字」还是「字卡」
 * 拼音打字：一个字母一个字母蹦出来，最后出对应中文
 */
(function () {
    'use strict';

    // ========== 设置存储键 ==========
    var SETTINGS_KEY = 'pinyinTypingEnabled';

    // ========== 默认开启 ==========
    var pinyinTypingEnabled = localStorage.getItem(SETTINGS_KEY) !== 'false';

    // ========== 拼音音节库 ==========
    // 格式：{ 拼音: [对应汉字数组] }
    // 只收录高频常用音节，保证拼出来的字能看懂
    var PINYIN_DB = {
        'a': ['啊', '阿'],
        'ai': ['爱', '哎', '唉', '哀'],
        'an': ['安', '暗', '按', '案'],
        'ang': ['昂'],
        'ao': ['奥', '傲', '熬'],
        'ba': ['吧', '把', '八', '爸', '巴'],
        'bai': ['白', '百', '拜', '摆'],
        'ban': ['半', '班', '搬', '办'],
        'bang': ['帮', '棒', '绑'],
        'bao': ['宝', '抱', '包', '饱', '报'],
        'bei': ['被', '背', '悲', '杯', '北'],
        'ben': ['本', '笨', '奔'],
        'beng': ['蹦', '崩'],
        'bi': ['比', '必', '笔', '逼', '避'],
        'bian': ['变', '边', '便', '遍', '编'],
        'biao': ['表', '标'],
        'bie': ['别', '憋'],
        'bin': ['宾', '斌'],
        'bing': ['病', '并', '冰', '兵', '饼'],
        'bo': ['波', '播', '博', '薄', '拨'],
        'bu': ['不', '步', '部', '补', '布'],
        'ca': ['擦'],
        'cai': ['才', '菜', '猜', '彩', '踩'],
        'can': ['残', '参', '餐', '惨'],
        'cang': ['藏', '仓'],
        'cao': ['草', '操', '曹'],
        'ce': ['测', '侧', '策', '册'],
        'ceng': ['层', '曾', '蹭'],
        'cha': ['差', '查', '茶', '插', '叉'],
        'chai': ['拆', '柴'],
        'chan': ['产', '缠', '馋', '禅'],
        'chang': ['长', '常', '场', '唱', '尝'],
        'chao': ['超', '朝', '吵', '炒', '潮'],
        'che': ['车', '彻', '扯'],
        'chen': ['沉', '陈', '尘', '晨'],
        'cheng': ['成', '城', '程', '诚', '称'],
        'chi': ['吃', '迟', '池', '持', '尺'],
        'chong': ['冲', '重', '充', '虫'],
        'chou': ['抽', '愁', '丑', '臭'],
        'chu': ['出', '初', '除', '处', '触'],
        'chuan': ['穿', '船', '传', '川', '喘'],
        'chuang': ['窗', '床', '创', '闯', '疮'],
        'chui': ['吹', '垂', '锤'],
        'chun': ['春', '纯', '唇', '蠢'],
        'ci': ['次', '此', '词', '刺', '慈'],
        'cong': ['从', '聪', '葱', '匆'],
        'cu': ['粗', '醋', '促'],
        'cuan': ['窜', '攒'],
        'cui': ['催', '脆', '翠'],
        'cun': ['存', '村', '寸'],
        'cuo': ['错', '搓', '挫'],
        'da': ['大', '打', '答', '达', '搭'],
        'dai': ['带', '待', '呆', '戴', '袋'],
        'dan': ['单', '但', '担', '淡', '蛋'],
        'dang': ['当', '挡', '党', '荡'],
        'dao': ['到', '道', '倒', '刀', '岛'],
        'de': ['的', '得', '德'],
        'deng': ['等', '灯', '登', '邓'],
        'di': ['地', '低', '底', '弟', '第'],
        'dian': ['点', '电', '店', '典', '惦'],
        'diao': ['掉', '调', '雕', '吊'],
        'die': ['跌', '爹', '叠', '蝶'],
        'ding': ['定', '顶', '丁', '钉', '订'],
        'diu': ['丢'],
        'dong': ['动', '东', '冬', '懂', '洞'],
        'dou': ['都', '斗', '豆', '逗'],
        'du': ['读', '度', '独', '肚', '堵'],
        'duan': ['短', '段', '断', '端'],
        'dui': ['对', '队', '堆'],
        'dun': ['顿', '蹲', '盾'],
        'duo': ['多', '朵', '躲', '夺'],
        'e': ['饿', '额', '恶', '鹅'],
        'en': ['嗯', '恩'],
        'er': ['而', '儿', '二', '耳', '尔'],
        'fa': ['发', '法', '罚', '乏'],
        'fan': ['反', '饭', '翻', '烦', '凡'],
        'fang': ['方', '放', '房', '防', '访'],
        'fei': ['非', '飞', '费', '肥', '废'],
        'fen': ['分', '份', '粉', '奋', '纷'],
        'feng': ['风', '疯', '封', '峰', '丰'],
        'fo': ['佛'],
        'fou': ['否'],
        'fu': ['服', '福', '富', '父', '付'],
        'ga': ['嘎'],
        'gai': ['该', '改', '盖', '概'],
        'gan': ['干', '感', '赶', '敢', '甘'],
        'gang': ['刚', '钢', '港', '岗'],
        'gao': ['高', '告', '搞', '糕', '稿'],
        'ge': ['个', '歌', '哥', '格', '割'],
        'gei': ['给'],
        'gen': ['跟', '根'],
        'geng': ['更', '耕', '梗'],
        'gong': ['工', '公', '共', '功', '攻'],
        'gou': ['够', '狗', '沟', '构', '钩'],
        'gu': ['古', '故', '顾', '鼓', '谷'],
        'gua': ['挂', '瓜', '刮', '寡'],
        'guai': ['怪', '拐', '乖'],
        'guan': ['关', '管', '观', '官', '馆'],
        'guang': ['光', '广', '逛'],
        'gui': ['贵', '归', '鬼', '跪', '规'],
        'gun': ['滚', '棍'],
        'guo': ['过', '国', '果', '锅', '裹'],
        'ha': ['哈'],
        'hai': ['还', '海', '害', '孩', '嗨'],
        'han': ['喊', '汉', '含', '寒', '韩'],
        'hang': ['行', '航', '杭'],
        'hao': ['好', '号', '毫', '豪', '耗'],
        'he': ['和', '喝', '何', '合', '河'],
        'hei': ['黑', '嘿'],
        'hen': ['很', '恨', '狠', '痕'],
        'heng': ['横', '哼', '恒'],
        'hong': ['红', '哄', '洪', '宏'],
        'hou': ['后', '厚', '猴', '候', '喉'],
        'hu': ['呼', '湖', '虎', '户', '护'],
        'hua': ['话', '花', '画', '化', '华'],
        'huai': ['坏', '怀', '淮'],
        'huan': ['换', '欢', '还', '环', '缓'],
        'huang': ['黄', '慌', '皇', '晃', '荒'],
        'hui': ['会', '回', '灰', '悔', '挥'],
        'hun': ['混', '昏', '婚', '魂'],
        'huo': ['活', '火', '货', '获', '伙'],
        'ji': ['几', '记', '机', '及', '极'],
        'jia': ['家', '加', '假', '价', '架'],
        'jian': ['见', '间', '件', '简', '建'],
        'jiang': ['讲', '将', '江', '奖', '降'],
        'jiao': ['叫', '教', '脚', '角', '交'],
        'jie': ['接', '结', '解', '街', '姐'],
        'jin': ['进', '近', '金', '今', '紧'],
        'jing': ['经', '静', '惊', '京', '精'],
        'jiong': ['窘'],
        'jiu': ['就', '九', '久', '酒', '救'],
        'ju': ['句', '举', '局', '居', '据'],
        'juan': ['卷', '捐', '倦'],
        'jue': ['觉', '决', '绝', '角', '掘'],
        'jun': ['军', '均', '君', '俊'],
        'ka': ['卡', '咖', '喀'],
        'kai': ['开', '慨', '楷'],
        'kan': ['看', '砍', '刊', '堪'],
        'kang': ['抗', '康', '扛'],
        'kao': ['靠', '考', '烤'],
        'ke': ['可', '克', '客', '课', '刻'],
        'ken': ['肯', '啃', '恳'],
        'keng': ['坑'],
        'kong': ['空', '恐', '孔', '控'],
        'kou': ['口', '扣', '抠'],
        'ku': ['哭', '苦', '库', '酷', '裤'],
        'kua': ['夸', '跨', '垮'],
        'kuai': ['快', '块', '筷'],
        'kuan': ['宽', '款'],
        'kuang': ['狂', '框', '况', '矿'],
        'kui': ['亏', '愧', '溃'],
        'kun': ['困', '昆'],
        'kuo': ['阔', '扩'],
        'la': ['啦', '拉', '辣', '蜡', '喇'],
        'lai': ['来', '赖', '莱'],
        'lan': ['懒', '蓝', '烂', '兰', '拦'],
        'lang': ['浪', '狼', '朗', '郎'],
        'lao': ['老', '劳', '牢', '唠'],
        'le': ['了', '乐', '勒'],
        'lei': ['累', '雷', '泪', '类', '垒'],
        'leng': ['冷', '愣', '棱'],
        'li': ['里', '离', '力', '立', '理'],
        'lian': ['连', '脸', '恋', '练', '联'],
        'liang': ['两', '亮', '量', '凉', '良'],
        'liao': ['聊', '了', '料', '疗', '辽'],
        'lie': ['列', '裂', '烈', '猎'],
        'lin': ['临', '林', '淋', '邻', '磷'],
        'ling': ['零', '领', '令', '灵', '铃'],
        'liu': ['六', '留', '流', '刘', '溜'],
        'long': ['龙', '弄', '笼', '隆'],
        'lou': ['楼', '漏', '搂', '露'],
        'lu': ['路', '露', '录', '陆', '鹿'],
        'lv': ['绿', '率', '旅', '律', '虑'],
        'luan': ['乱', '卵'],
        'lue': ['略'],
        'lun': ['论', '轮', '伦'],
        'luo': ['落', '罗', '络', '裸', '骆'],
        'ma': ['妈', '马', '嘛', '骂', '麻'],
        'mai': ['买', '卖', '麦', '埋', '迈'],
        'man': ['慢', '满', '漫', '蛮', '蔓'],
        'mang': ['忙', '盲', '茫', '芒'],
        'mao': ['毛', '猫', '冒', '帽', '矛'],
        'me': ['么'],
        'mei': ['没', '美', '每', '妹', '霉'],
        'men': ['们', '门', '闷'],
        'meng': ['梦', '猛', '蒙', '萌'],
        'mi': ['米', '迷', '密', '秘', '蜜'],
        'mian': ['面', '免', '棉', '眠', '绵'],
        'miao': ['秒', '苗', '妙', '描', '庙'],
        'mie': ['灭', '蔑'],
        'min': ['民', '敏', '闽'],
        'ming': ['名', '明', '命', '鸣', '铭'],
        'miu': ['谬'],
        'mo': ['摸', '魔', '末', '莫', '墨'],
        'mou': ['某', '谋'],
        'mu': ['木', '母', '目', '幕', '慕'],
        'na': ['那', '拿', '哪', '纳', '呐'],
        'nai': ['奶', '耐', '乃', '奈'],
        'nan': ['难', '男', '南', '喃'],
        'nang': ['囊'],
        'nao': ['闹', '脑', '恼'],
        'ne': ['呢'],
        'nei': ['内'],
        'nen': ['嫩'],
        'neng': ['能'],
        'ni': ['你', '泥', '尼', '逆', '腻'],
        'nian': ['年', '念', '粘', '碾'],
        'niang': ['娘', '酿'],
        'niao': ['鸟', '尿'],
        'nie': ['捏', '聂'],
        'nin': ['您'],
        'ning': ['宁', '凝', '拧'],
        'niu': ['牛', '扭', '纽', '妞'],
        'nong': ['弄', '农', '浓'],
        'nu': ['怒', '奴', '努'],
        'nv': ['女'],
        'nuan': ['暖'],
        'nue': ['虐'],
        'nuo': ['诺', '挪', '懦'],
        'o': ['哦', '噢', '喔'],
        'ou': ['欧', '偶', '呕', '鸥'],
        'pa': ['怕', '爬', '趴', '帕'],
        'pai': ['拍', '排', '派', '牌'],
        'pan': ['盘', '盼', '判', '叛', '攀'],
        'pang': ['胖', '旁', '庞', '乓'],
        'pao': ['跑', '泡', '炮', '抛', '袍'],
        'pei': ['陪', '配', '赔', '佩', '培'],
        'pen': ['喷', '盆'],
        'peng': ['朋', '碰', '棚', '捧', '蓬'],
        'pi': ['批', '皮', '屁', '披', '疲'],
        'pian': ['片', '骗', '偏', '篇', '翩'],
        'piao': ['票', '飘', '漂', '瓢'],
        'pie': ['撇', '瞥'],
        'pin': ['拼', '品', '贫', '频'],
        'ping': ['平', '评', '苹', '瓶', '凭'],
        'po': ['破', '坡', '婆', '泼', '迫'],
        'pou': ['剖'],
        'pu': ['铺', '普', '扑', '谱', '葡'],
        'qi': ['起', '气', '其', '七', '期'],
        'qia': ['恰', '卡', '掐'],
        'qian': ['前', '钱', '千', '签', '欠'],
        'qiang': ['强', '抢', '墙', '枪', '腔'],
        'qiao': ['桥', '瞧', '敲', '巧', '翘'],
        'qie': ['切', '且', '茄', '窃'],
        'qin': ['亲', '琴', '勤', '秦', '寝'],
        'qing': ['请', '清', '情', '轻', '晴'],
        'qiong': ['穷', '琼'],
        'qiu': ['秋', '求', '球', '丘', '囚'],
        'qu': ['去', '取', '区', '曲', '趣'],
        'quan': ['全', '圈', '权', '劝', '拳'],
        'que': ['却', '确', '缺', '雀', '鹊'],
        'qun': ['群', '裙'],
        'ran': ['然', '染', '燃', '冉'],
        'rang': ['让', '嚷', '瓤'],
        'rao': ['绕', '饶', '扰'],
        're': ['热', '惹'],
        'ren': ['人', '认', '任', '忍', '仁'],
        'reng': ['扔'],
        'ri': ['日'],
        'rong': ['容', '融', '荣', '绒', '溶'],
        'rou': ['肉', '柔', '揉'],
        'ru': ['如', '入', '乳', '辱', '儒'],
        'ruan': ['软', '阮'],
        'rui': ['瑞', '锐'],
        'run': ['润'],
        'ruo': ['若', '弱'],
        'sa': ['撒', '洒', '萨'],
        'sai': ['塞', '赛', '腮'],
        'san': ['三', '散', '伞', '叁'],
        'sang': ['桑', '嗓', '丧'],
        'sao': ['扫', '骚', '嫂'],
        'se': ['色', '涩', '瑟'],
        'sen': ['森'],
        'seng': ['僧'],
        'sha': ['傻', '杀', '沙', '啥', '纱'],
        'shai': ['晒', '筛'],
        'shan': ['山', '闪', '善', '衫', '扇'],
        'shang': ['上', '伤', '商', '尚', '赏'],
        'shao': ['少', '烧', '稍', '勺', '邵'],
        'she': ['社', '设', '舍', '射', '蛇'],
        'shei': ['谁'],
        'shen': ['什', '身', '深', '神', '甚'],
        'sheng': ['生', '声', '胜', '升', '圣'],
        'shi': ['是', '事', '时', '世', '市'],
        'shou': ['手', '收', '受', '首', '瘦'],
        'shu': ['书', '数', '树', '输', '叔'],
        'shua': ['刷', '耍'],
        'shuai': ['帅', '摔', '甩'],
        'shuan': ['拴', '栓'],
        'shuang': ['双', '爽', '霜'],
        'shui': ['水', '谁', '睡', '税'],
        'shun': ['顺', '瞬', '吮'],
        'shuo': ['说', '硕', '朔'],
        'si': ['四', '思', '死', '丝', '私'],
        'song': ['送', '松', '颂', '宋', '耸'],
        'sou': ['搜', '艘', '嗽'],
        'su': ['素', '速', '苏', '诉', '宿'],
        'suan': ['算', '酸', '蒜'],
        'sui': ['岁', '虽', '随', '碎', '遂'],
        'sun': ['孙', '损', '笋'],
        'suo': ['所', '缩', '锁', '索', '嗦'],
        'ta': ['他', '她', '它', '塔', '踏'],
        'tai': ['太', '台', '态', '抬', '胎'],
        'tan': ['谈', '弹', '叹', '滩', '探'],
        'tang': ['汤', '堂', '糖', '躺', '烫'],
        'tao': ['逃', '套', '桃', '掏', '淘'],
        'te': ['特'],
        'teng': ['疼', '腾', '藤'],
        'ti': ['题', '提', '体', '踢', '替'],
        'tian': ['天', '田', '甜', '填', '舔'],
        'tiao': ['跳', '条', '挑', '调', '迢'],
        'tie': ['贴', '铁', '帖'],
        'ting': ['听', '停', '挺', '厅', '亭'],
        'tong': ['同', '通', '痛', '童', '桶'],
        'tou': ['头', '偷', '投', '透', '抖'],
        'tu': ['土', '图', '突', '吐', '兔'],
        'tuan': ['团', '湍'],
        'tui': ['推', '腿', '退', '褪'],
        'tun': ['吞', '屯', '臀'],
        'tuo': ['拖', '脱', '托', '妥', '驼'],
        'wa': ['哇', '娃', '挖', '袜', '蛙'],
        'wai': ['外', '歪'],
        'wan': ['完', '晚', '玩', '万', '碗'],
        'wang': ['网', '王', '往', '忘', '望'],
        'wei': ['为', '喂', '位', '未', '味'],
        'wen': ['问', '文', '闻', '温', '吻'],
        'weng': ['嗡'],
        'wo': ['我', '窝', '握', '卧', '蜗'],
        'wu': ['无', '五', '物', '舞', '午'],
        'xi': ['西', '系', '洗', '细', '喜'],
        'xia': ['下', '吓', '夏', '虾', '瞎'],
        'xian': ['先', '现', '线', '显', '险'],
        'xiang': ['想', '向', '像', '香', '相'],
        'xiao': ['笑', '小', '消', '校', '孝'],
        'xie': ['谢', '写', '些', '鞋', '血'],
        'xin': ['心', '新', '信', '辛', '欣'],
        'xing': ['行', '醒', '星', '性', '姓'],
        'xiong': ['熊', '兄', '胸', '雄'],
        'xiu': ['休', '修', '羞', '秀', '锈'],
        'xu': ['需', '许', '续', '虚', '须'],
        'xuan': ['选', '宣', '悬', '旋', '炫'],
        'xue': ['学', '雪', '血', '穴', '靴'],
        'xun': ['寻', '训', '询', '迅', '巡'],
        'ya': ['呀', '压', '牙', '鸭', '雅'],
        'yan': ['眼', '言', '烟', '严', '演'],
        'yang': ['样', '养', '阳', '央', '仰'],
        'yao': ['要', '药', '摇', '咬', '腰'],
        'ye': ['也', '夜', '业', '叶', '爷'],
        'yi': ['一', '已', '以', '意', '衣'],
        'yin': ['因', '音', '银', '引', '印'],
        'ying': ['应', '硬', '迎', '赢', '影'],
        'yo': ['哟', '唷'],
        'yong': ['用', '永', '勇', '拥', '涌'],
        'you': ['有', '又', '右', '游', '友'],
        'yu': ['于', '与', '雨', '鱼', '遇'],
        'yuan': ['远', '愿', '原', '元', '圆'],
        'yue': ['月', '越', '约', '悦', '跃'],
        'yun': ['云', '运', '允', '晕', '孕'],
        'za': ['杂', '咋', '砸', '扎'],
        'zai': ['在', '再', '载', '灾', '栽'],
        'zan': ['咱', '暂', '赞', '攒'],
        'zang': ['脏', '葬', '藏'],
        'zao': ['早', '遭', '造', '澡', '枣'],
        'ze': ['则', '责', '择', '泽'],
        'zei': ['贼'],
        'zen': ['怎'],
        'zeng': ['增', '赠', '曾'],
        'zha': ['炸', '扎', '眨', '渣', '榨'],
        'zhai': ['摘', '宅', '窄', '债'],
        'zhan': ['站', '占', '战', '展', '沾'],
        'zhang': ['长', '张', '章', '掌', '丈'],
        'zhao': ['找', '着', '照', '招', '罩'],
        'zhe': ['这', '着', '折', '者', '遮'],
        'zhen': ['真', '阵', '镇', '震', '珍'],
        'zheng': ['正', '整', '争', '证', '睁'],
        'zhi': ['只', '之', '直', '知', '指'],
        'zhong': ['中', '种', '重', '钟', '终'],
        'zhou': ['周', '州', '皱', '洲', '粥'],
        'zhu': ['住', '主', '猪', '竹', '祝'],
        'zhua': ['抓', '爪'],
        'zhuai': ['拽'],
        'zhuan': ['转', '专', '赚', '砖'],
        'zhuang': ['装', '撞', '庄', '壮', '状'],
        'zhui': ['追', '坠', '锥'],
        'zhun': ['准'],
        'zhuo': ['桌', '捉', '灼', '卓'],
        'zi': ['子', '自', '字', '紫', '资'],
        'zong': ['总', '宗', '纵', '踪'],
        'zou': ['走', '揍', '奏', '邹'],
        'zu': ['组', '族', '足', '租', '祖'],
        'zuan': ['钻', '攥'],
        'zui': ['最', '嘴', '醉', '罪'],
        'zun': ['尊', '遵'],
        'zuo': ['做', '坐', '左', '作', '昨']
    };

    // 音节列表（用于随机抽取）
    var SYLLABLES = Object.keys(PINYIN_DB);
  
    // ========== 工具函数 ==========

    // 从数组里随机抽一个
    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // 从 a-z 里随机抽一个字母
    function randomLetter() {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        return letters[Math.floor(Math.random() * letters.length)];
    }

    // 随机标点（用于字母串末尾/中间插入）
    var PUNCTUATIONS = [' ', ' ', ' ', ' ', ',', '.', '!', '?', ';', ':', '-', '~'];

    // ========== 生成拼音串 + 对应中文 ==========

    /**
     * 生成一条随机拼音
     * 返回 { pinyin: "ni wo sheng qi", chinese: "你我生气" }
     */
    function generateRandomPinyin() {
        // 随机 1~6 个音节
        var count = Math.floor(Math.random() * 6) + 1;
        var pinyinParts = [];
        var chineseParts = [];

        for (var i = 0; i < count; i++) {
            var syllable = pickRandom(SYLLABLES);
            var candidates = PINYIN_DB[syllable];
            var hanzi = pickRandom(candidates);
            pinyinParts.push(syllable);
            chineseParts.push(hanzi);
        }

        // 音节之间用空格隔开
        var pinyinStr = pinyinParts.join(' ');

        // 中文之间不加空格（中文本来就不用空格）
        // 偶尔随机加个标点（30% 概率）
        var chineseStr = chineseParts.join('');
        if (Math.random() < 0.3) {
            chineseStr += pickRandom(['。', '！', '？', '，', '…']);
        }

        return {
            pinyin: pinyinStr,
            chinese: chineseStr
        };
    }

    // ========== 蹦字母动画 ==========

    var typingTimer = null;       // 定时器
    var isTypingActive = false;   // 是否正在蹦字

    /**
     * 在指定元素里一个字母一个字母蹦出拼音
     * @param {HTMLElement} el - 显示字母的容器
     * @param {string} pinyin - 拼音串
     * @param {Function} onDone - 蹦完后的回调
     */
    function typePinyinLetters(el, pinyin, onDone) {
        if (!el) { if (onDone) onDone(); return; }

        el.textContent = '';
        isTypingActive = true;

        var index = 0;
        var total = pinyin.length;

        function step() {
            if (!isTypingActive) return; // 被打断，停止

            if (index >= total) {
                // 蹦完了
                isTypingActive = false;
                if (typingTimer) { clearTimeout(typingTimer); typingTimer = null; }
                if (onDone) {
                    // 蹦完后停顿一下再出中文
                    setTimeout(onDone, 400 + Math.random() * 300);
                }
                return;
            }

            var ch = pinyin[index];
            el.textContent += ch;
            index++;

            // 计算下一个字母的延迟
            var delay;
            if (ch === ' ') {
                // 空格后稍微停一下，像换了个音节
                delay = 180 + Math.random() * 120;
            } else {
                // 普通字母 80~150 毫秒
                delay = 80 + Math.random() * 70;
            }

            typingTimer = setTimeout(step, delay);
        }

        step();
    }

    /**
     * 停止蹦字
     */
    function stopTyping() {
        isTypingActive = false;
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }
    }

    // ========== 和现有「正在输入」气泡对接 ==========

    /**
     * 在正在输入气泡里插入一行「拼音显示区」
     * 如果已经存在，就返回它
     */
    function ensurePinyinLine() {
        var indicator = document.getElementById('typing-indicator');
        if (!indicator) return null;

        // 已经存在了，直接返回
        var existing = document.getElementById('typing-pinyin-line');
        if (existing) return existing;

        // 创建新的一行
        var line = document.createElement('div');
        line.id = 'typing-pinyin-line';
        line.style.cssText = [
            'width: 100%',
            'font-size: 12px',
            'font-family: monospace, "Courier New", monospace',
            'color: var(--text-secondary)',
            'opacity: 0.75',
            'padding: 4px 12px 2px',
            'letter-spacing: 1px',
            'word-break: break-all',
            'text-align: left',
            'min-height: 16px',
            'line-height: 1.4',
            'border-top: 1px dashed rgba(var(--accent-color-rgb), 0.15)',
            'margin-top: 4px'
        ].join(';');

        // 让气泡变成纵向排列
        indicator.style.flexWrap = 'wrap';
        indicator.style.alignItems = 'center';

        // 把新行插到气泡的末尾
        indicator.appendChild(line);

        return line;
    }

    /**
     * 移除拼音行
     */
    function removePinyinLine() {
        var line = document.getElementById('typing-pinyin-line');
        if (line) line.remove();
        var indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.flexWrap = '';
            indicator.style.alignItems = '';
        }
    }

    // ========== 核心：跑一次「拼音打字」流程 ==========

    /**
     * @param {Function} onComplete - 蹦完拼音后，用 chinese 内容调用它
     *                                它应当负责：隐藏气泡、发消息
     */
    function runPinyinTyping(onComplete) {
        var data = generateRandomPinyin();

        // 让「正在输入」气泡先显示
        var wrapper = document.getElementById('typing-indicator-wrapper');
        var label = document.getElementById('typing-indicator-label');

        if (wrapper) {
            wrapper.style.display = 'block';
        }
        if (label) {
            label.textContent = (window.settings && settings.partnerName ? settings.partnerName : '对方') + ' 正在输入';
        }

        // 定位气泡（因为输入框高度可能变了）
        if (typeof positionTypingIndicator === 'function') {
            try { positionTypingIndicator(); } catch (e) {}
        }

        // 建拼音行
        var pinyinLine = ensurePinyinLine();

        // 滚动到底部
        var chatContainer = document.getElementById('chat-container');
        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

        // 蹦字母
        typePinyinLetters(pinyinLine, data.pinyin, function () {
            // 拼音蹦完了 —— 停顿一下再收气泡
            setTimeout(function () {
                // 隐藏气泡
                if (wrapper) wrapper.style.display = 'none';
                removePinyinLine();

                // 交给调用方去发中文
                if (onComplete) onComplete(data.chinese);
            }, 300 + Math.random() * 200);
        });
    }

    // ========== 设置开关 ==========

    function isPinyinTypingEnabled() {
        return localStorage.getItem(SETTINGS_KEY) !== 'false';
    }

    function setPinyinTypingEnabled(enabled) {
        localStorage.setItem(SETTINGS_KEY, enabled ? 'true' : 'false');
    }

    // 暴露给外部用
    window.PinyinTyping = {
        run: runPinyinTyping,
        stop: stopTyping,
        isEnabled: isPinyinTypingEnabled,
        setEnabled: setPinyinTypingEnabled,
        generate: generateRandomPinyin
    };

    // ========== 自动绑定 UI 开关（如果页面上有这个开关） ==========
    document.addEventListener('DOMContentLoaded', function () {
        var toggle = document.getElementById('pinyin-typing-toggle');
        if (!toggle) return;

        // 初始化状态
        if (isPinyinTypingEnabled()) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }

        // 点击切换
        toggle.addEventListener('click', function () {
            var next = !isPinyinTypingEnabled();
            setPinyinTypingEnabled(next);
            toggle.classList.toggle('active', next);
            if (typeof showNotification === 'function') {
                showNotification(next ? '拼音打字已开启' : '拼音打字已关闭', 'success', 1500);
            }
        });
    });

})();
