import { writeFileSync } from "fs";

const questions = [
// ===== 第一單元 力與運動 (20題) =====
{id:"SCI-FM-01",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"1",question:"下列哪一個是「力」的作用結果？",options:["讓物體動起來","讓物體變色","讓物體消失","讓物體發出聲音"],answer:"讓物體動起來",hint:"力可以改變物體的運動狀態或形狀。",explanation:"力可以使物體開始運動、停止運動、改變方向或改變形狀。"},
{id:"SCI-FM-02",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"1",question:"把球往上丟，球最後會掉下來，是因為什麼力？",options:["地心引力","摩擦力","彈力","磁力"],answer:"地心引力",hint:"地球會把東西往下拉。",explanation:"地心引力（重力）會把所有物體往地球中心拉。"},
{id:"SCI-FM-03",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"1",question:"用手推桌子，桌子沒動，是因為什麼力在阻擋？",options:["摩擦力","浮力","彈力","磁力"],answer:"摩擦力",hint:"桌腳和地板之間有阻止滑動的力。",explanation:"摩擦力是兩個接觸面之間阻止相對運動的力。"},
{id:"SCI-FM-04",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"2",question:"力的三要素不包括下列哪一項？",options:["力的顏色","力的大小","力的方向","力的作用點"],answer:"力的顏色",hint:"力是看不見的，沒有顏色。",explanation:"力的三要素是：大小、方向、作用點。"},
{id:"SCI-FM-05",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"2",question:"在冰面上走路容易滑倒，是因為冰面的什麼力很小？",options:["摩擦力","重力","浮力","彈力"],answer:"摩擦力",hint:"冰很滑。",explanation:"冰面光滑，摩擦力很小，腳底不容易抓地。"},
{id:"SCI-FM-06",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"2",question:"用橡皮筋射紙飛機，紙飛機飛出去是利用什麼力？",options:["彈力","摩擦力","浮力","磁力"],answer:"彈力",hint:"橡皮筋被拉開後會彈回來。",explanation:"橡皮筋被拉長會產生彈力，放開後彈力推動紙飛機。"},
{id:"SCI-FM-07",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"3",question:"下列哪一個是「槓桿原理」的應用？",options:["剪刀","電風扇","電燈","冰箱"],answer:"剪刀",hint:"剪刀有兩根桿加一個支點。",explanation:"剪刀是典型的槓桿，支點在螺絲處，施力在把手，抗力在刀刃。"},
{id:"SCI-FM-08",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"3",question:"搬重物走斜坡比樓梯輕鬆，這是利用什麼簡單機械？",options:["斜面","槓桿","滑輪","齒輪"],answer:"斜面",hint:"坡道就是一種簡單機械。",explanation:"斜面可以用較小的力沿較長路徑將物體抬高，省力但費距離。"},
{id:"SCI-FM-09",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"3",question:"坐車時車突然煞車，身體會往前傾，這是什麼現象？",options:["慣性","浮力","彈性","磁性"],answer:"慣性",hint:"物體有維持原本運動狀態的傾向。",explanation:"慣性是物體保持原有運動狀態的性質。車停了但身體還想往前。"},
{id:"SCI-FM-10",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"4",question:"用定滑輪提重物，下列敘述何者正確？",options:["不省力但改變施力方向","既省力又省距離","省力但不改變方向","不省力也不改變方向"],answer:"不省力但改變施力方向",hint:"想想旗杆上的滑輪。",explanation:"定滑輪不能省力，但可以改變施力方向（往下拉就能把東西往上提）。"},
{id:"SCI-FM-11",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"2",question:"下列何者不是減少摩擦力的方法？",options:["在地面撒沙子","在機器加潤滑油","把接觸面磨光滑","裝上輪子"],answer:"在地面撒沙子",hint:"撒沙子反而增加粗糙度。",explanation:"撒沙子增加粗糙度會增大摩擦力。潤滑油、光滑面、輪子都能減少摩擦力。"},
{id:"SCI-FM-12",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"4",question:"動滑輪可以省力，但跟定滑輪比較它的缺點是？",options:["不能改變施力方向","完全不能移動","會產生高溫","會增加重量十倍"],answer:"不能改變施力方向",hint:"動滑輪省力但拉繩方向不變。",explanation:"動滑輪可省一半的力，但施力方向無法改變，通常需與定滑輪搭配（滑輪組）。"},
{id:"SCI-FM-13",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"1",question:"磁鐵能吸引下列哪一種物品？",options:["迴紋針（鐵製）","木頭筷子","塑膠尺","玻璃杯"],answer:"迴紋針（鐵製）",hint:"磁鐵只吸含鐵的東西。",explanation:"磁鐵能吸引鐵、鈷、鎳等金屬，迴紋針是鐵製的所以能被吸引。"},
{id:"SCI-FM-14",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"3",question:"螺絲釘的螺紋其實是一種什麼簡單機械的變形？",options:["斜面","槓桿","滑輪","輪軸"],answer:"斜面",hint:"把螺紋展開來看是一條斜線。",explanation:"螺絲的螺紋展開就是一個斜面，旋轉螺絲等於沿斜面施力所以能省力。"},
{id:"SCI-FM-15",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"5",question:"槓桿施力臂是抗力臂 3 倍長，舉起 60 公斤重物至少需多大的力？",options:["20 公斤重","60 公斤重","180 公斤重","30 公斤重"],answer:"20 公斤重",hint:"施力×施力臂 = 抗力×抗力臂。",explanation:"施力臂是抗力臂 3 倍，施力 = 60÷3 = 20 公斤重。"},
{id:"SCI-FM-16",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"2",question:"腳踏車的把手和輪子是利用什麼簡單機械原理？",options:["輪軸","斜面","滑輪","槓桿"],answer:"輪軸",hint:"大圓帶動小圓。",explanation:"把手是輪（大圓），轉動時帶動車輪軸心，是輪軸的應用。"},
{id:"SCI-FM-17",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"4",question:"太空人在太空站中會漂浮，主要是因為？",options:["處於持續自由落體狀態","完全沒有重力","太空沒有空氣","穿了特殊衣服"],answer:"處於持續自由落體狀態",hint:"太空站其實也在「掉」，只是邊掉邊繞地球轉。",explanation:"太空站和太空人都在繞地球做自由落體，所以相對太空站太空人感覺失重。"},
{id:"SCI-FM-18",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"1",question:"蹺蹺板是利用什麼原理？",options:["槓桿原理","磁力","浮力","彈力"],answer:"槓桿原理",hint:"中間有支撐點，兩邊上下。",explanation:"蹺蹺板是最典型的槓桿：中間是支點，兩端施力。"},
{id:"SCI-FM-19",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"3",question:"汽車輪胎表面做成有花紋（胎紋）是為了？",options:["增加摩擦力防止打滑","減少摩擦力省油","讓輪胎更美觀","減輕輪胎重量"],answer:"增加摩擦力防止打滑",hint:"如果輪胎完全光滑會怎樣？",explanation:"胎紋增加輪胎與地面的摩擦力，特別是濕滑路面能排水防滑。"},
{id:"SCI-FM-20",subject:"康軒五下自然",category:"第一單元 力與運動",difficulty:"5",question:"10 公斤物體在地球重約 98 牛頓。帶到月球（重力地球 1/6）重量約？",options:["約 16.3 牛頓","98 牛頓","0 牛頓","約 588 牛頓"],answer:"約 16.3 牛頓",hint:"月球重力是地球六分之一。",explanation:"98÷6≈16.3 牛頓。質量不變（10 公斤）但重量會改變。"},

// ===== 第二單元 大地的奧祕 (20題) =====
{id:"SCI-EA-01",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"1",question:"地球最外層叫什麼？",options:["地殼","地函","地核","岩漿"],answer:"地殼",hint:"像雞蛋的蛋殼。",explanation:"地球由外而內分為地殼、地函、地核三層。"},
{id:"SCI-EA-02",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"1",question:"化石是什麼？",options:["古代生物遺跡保存在岩石中","人造的石頭","火山噴出的石頭","海水結晶"],answer:"古代生物遺跡保存在岩石中",hint:"恐龍骨頭變成石頭就是一種。",explanation:"化石是古代生物的遺體或遺跡經長時間被泥沙掩埋後保存在岩石中。"},
{id:"SCI-EA-03",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"2",question:"岩漿冷卻凝固形成的岩石叫什麼？",options:["火成岩","沉積岩","變質岩","化石岩"],answer:"火成岩",hint:"「火」成岩和「火」山有關。",explanation:"火成岩是岩漿冷卻後凝固形成的岩石，如花崗岩、玄武岩。"},
{id:"SCI-EA-04",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"2",question:"泥沙一層層堆積後變硬形成的岩石叫什麼？",options:["沉積岩","火成岩","變質岩","礦物"],answer:"沉積岩",hint:"沉下去堆積起來的。",explanation:"沉積岩由泥沙碎石層層沉積壓實後形成，常見層狀構造。"},
{id:"SCI-EA-05",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"3",question:"臺灣經常地震的主要原因是？",options:["位於板塊交界處","離太陽太近","海水太多","山太高"],answer:"位於板塊交界處",hint:"板塊互相推擠會釋放能量。",explanation:"臺灣位於歐亞板塊和菲律賓海板塊交界，板塊碰撞造成頻繁地震。"},
{id:"SCI-EA-06",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"2",question:"岩石受風吹日曬雨淋而崩裂碎化叫什麼？",options:["風化","風暴","颱風","沉積"],answer:"風化",hint:"被風、水、溫度慢慢「化」開。",explanation:"風化是岩石在原地受溫度變化、水、風等外力影響而逐漸崩裂的過程。"},
{id:"SCI-EA-07",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"3",question:"河流上游石頭大且有稜角，下游石頭小且圓滑，是因為？",options:["搬運和侵蝕磨損","風化","火山噴發","人工打磨"],answer:"搬運和侵蝕磨損",hint:"石頭在河裡被水沖、互相碰撞。",explanation:"石頭在河流搬運中不斷碰撞磨擦，稜角被磨掉越來越圓滑。"},
{id:"SCI-EA-08",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"1",question:"火山噴發時噴出的高溫液體叫什麼？",options:["岩漿","海水","石油","水蒸氣"],answer:"岩漿",hint:"非常高溫的液態石頭。",explanation:"岩漿是地球內部高溫熔化的岩石，噴出地表後稱為熔岩。"},
{id:"SCI-EA-09",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"4",question:"大理石由石灰岩經高溫高壓變化而成，屬於哪類岩石？",options:["變質岩","火成岩","沉積岩","人造岩"],answer:"變質岩",hint:"原有的岩石被「變」了質。",explanation:"變質岩是原有岩石在高溫高壓下結構和成分改變而形成的新岩石。"},
{id:"SCI-EA-10",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"3",question:"地震最初感受到的上下跳動是哪種地震波？",options:["P波（縱波）","S波（橫波）","海嘯","餘震"],answer:"P波（縱波）",hint:"P = Primary（第一個到達）。",explanation:"P波速度最快先到達（上下振動）；S波較慢隨後到達（左右搖晃）。"},
{id:"SCI-EA-11",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"1",question:"在沉積岩中最容易發現什麼？",options:["化石","鑽石","岩漿","金屬"],answer:"化石",hint:"沉積岩是一層層堆起來的，容易把生物埋進去。",explanation:"沉積岩由泥沙層層堆積，古代生物被埋在其中形成化石。"},
{id:"SCI-EA-12",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"4",question:"板塊飄浮在地球哪一層之上？",options:["地函上部（軟流圈）","地核","大氣層","海洋"],answer:"地函上部（軟流圈）",hint:"板塊之下有一層可以緩慢流動的岩石。",explanation:"板塊飄浮在地函上部的軟流圈上，軟流圈的岩石在高溫下可緩慢流動。"},
{id:"SCI-EA-13",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"2",question:"地震強度用什麼來衡量？",options:["震度和規模","溫度","風速","水深"],answer:"震度和規模",hint:"新聞常說「幾級」和「規模幾點幾」。",explanation:"震度表示各地搖晃程度（1~7級），規模表示地震釋放能量大小。"},
{id:"SCI-EA-14",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"5",question:"喜馬拉雅山脈是哪兩個板塊碰撞形成的？",options:["印度板塊和歐亞板塊","太平洋板塊和歐亞板塊","非洲板塊和歐亞板塊","南美板塊和北美板塊"],answer:"印度板塊和歐亞板塊",hint:"印度原本是一個「島」漂到亞洲撞上去。",explanation:"約5000萬年前印度板塊撞上歐亞板塊，持續推擠形成喜馬拉雅山脈。"},
{id:"SCI-EA-15",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"3",question:"河流哪個部分侵蝕作用最強？",options:["上游","中游","下游","出海口"],answer:"上游",hint:"上游坡度陡水流快。",explanation:"上游地勢陡峭水流湍急，對河床和兩岸侵蝕作用最強，常形成V型谷。"},
{id:"SCI-EA-16",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"2",question:"下列哪一個不是礦物？",options:["塑膠","石英","雲母","長石"],answer:"塑膠",hint:"礦物是天然形成的。",explanation:"礦物是自然界天然形成的無機物質。塑膠是人工合成的。"},
{id:"SCI-EA-17",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"4",question:"地球內部溫度最高的部分是？",options:["內地核","地殼","外地核","地函"],answer:"內地核",hint:"越往地球中心越熱。",explanation:"內地核溫度可達5000~6000°C，是地球最熱的部分。"},
{id:"SCI-EA-18",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"1",question:"地震來臨時應該怎麼做？",options:["趴下、掩護、穩住","跑到窗戶旁邊","搭電梯逃跑","站著不動"],answer:"趴下、掩護、穩住",hint:"DCH 三步驟。",explanation:"地震時應趴下、找掩護、穩住，遠離窗戶和大型家具。"},
{id:"SCI-EA-19",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"5",question:"高山上發現貝殼化石說明什麼？",options:["這裡以前曾是海底後來被抬升","有人把貝殼帶上山","貝殼會自己爬山","是假化石"],answer:"這裡以前曾是海底後來被抬升",hint:"板塊運動的力量。",explanation:"高山有海洋生物化石證明該地曾在海底，經板塊運動擠壓抬升才變成高山。"},
{id:"SCI-EA-20",subject:"康軒五下自然",category:"第二單元 大地的奧祕",difficulty:"3",question:"花崗岩和玄武岩都是火成岩，但有何不同？",options:["花崗岩地下慢冷結晶大，玄武岩地表快冷結晶小","顏色完全一樣","重量一樣","形成時間一樣"],answer:"花崗岩地下慢冷結晶大，玄武岩地表快冷結晶小",hint:"冷卻速度影響結晶大小。",explanation:"花崗岩深成岩地底慢冷結晶大；玄武岩噴出岩地表快冷結晶極小。"},

// ===== 第三單元 植物世界面面觀 (20題) =====
{id:"SCI-PL-01",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"1",question:"植物利用陽光製造養分的作用叫什麼？",options:["光合作用","呼吸作用","蒸散作用","消化作用"],answer:"光合作用",hint:"「光」＋「合成」。",explanation:"光合作用是植物利用陽光、水和二氧化碳製造葡萄糖和氧氣。"},
{id:"SCI-PL-02",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"1",question:"光合作用主要在植物哪個部位進行？",options:["葉子","根","花","果實"],answer:"葉子",hint:"葉子是綠色的因為有葉綠體。",explanation:"葉子含有大量葉綠體，是光合作用的主要場所。"},
{id:"SCI-PL-03",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"2",question:"光合作用需要哪些原料？",options:["水和二氧化碳","氧氣和葡萄糖","土壤和石頭","水和氧氣"],answer:"水和二氧化碳",hint:"根吸水，葉子氣孔吸收氣體。",explanation:"光合作用：水 + 二氧化碳 + 陽光 → 葡萄糖 + 氧氣。"},
{id:"SCI-PL-04",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"2",question:"植物的根最主要的功能是？",options:["吸收水分和礦物質","製造花粉","儲存陽光","進行光合作用"],answer:"吸收水分和礦物質",hint:"根埋在土裡。",explanation:"根從土壤中吸收水分和礦物質，同時固定植物。"},
{id:"SCI-PL-05",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"2",question:"植物水分從葉子散失到空氣中叫什麼？",options:["蒸散作用","光合作用","呼吸作用","吸收作用"],answer:"蒸散作用",hint:"水「蒸」發「散」出去。",explanation:"蒸散作用幫助水分向上運輸和降低葉面溫度。"},
{id:"SCI-PL-06",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"3",question:"光合作用會產生什麼氣體釋放到空氣中？",options:["氧氣","二氧化碳","氮氣","氫氣"],answer:"氧氣",hint:"我們呼吸需要的氣體。",explanation:"光合作用將水和二氧化碳轉化為葡萄糖和氧氣。"},
{id:"SCI-PL-07",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"1",question:"花的哪個部位會發育成果實？",options:["子房","花瓣","花萼","雄蕊"],answer:"子房",hint:"果實裡有種子。",explanation:"花授粉後子房發育成果實，胚珠發育成種子。"},
{id:"SCI-PL-08",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"3",question:"下列哪一種是植物的「無性繁殖」？",options:["扦插","種子播種","授粉結果","風媒花"],answer:"扦插",hint:"不需要種子就能長出新植物。",explanation:"扦插是剪下莖或葉插入土中生根發芽，不經授粉的無性繁殖。"},
{id:"SCI-PL-09",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"2",question:"哪種植物利用「風」來傳播種子？",options:["蒲公英","椰子","鬼針草","蓮霧"],answer:"蒲公英",hint:"蒲公英種子像小降落傘。",explanation:"蒲公英種子有絨毛構造可隨風飄散，典型的風力傳播。"},
{id:"SCI-PL-10",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"3",question:"仙人掌的葉退化成刺主要是為了？",options:["減少水分蒸發","吸收更多陽光","吸引昆蟲","增加光合作用"],answer:"減少水分蒸發",hint:"仙人掌在沙漠水很珍貴。",explanation:"沙漠缺水，仙人掌將葉退化成刺減少蒸散面積，莖變肥厚來儲水。"},
{id:"SCI-PL-11",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"4",question:"植物莖的「木質部」運輸什麼？",options:["水和礦物質（由下往上）","養分（由上往下）","空氣","陽光"],answer:"水和礦物質（由下往上）",hint:"木質部在裡面，韌皮部在外面。",explanation:"木質部由根向上運輸水和礦物質；韌皮部將葉製造的養分向下運輸。"},
{id:"SCI-PL-12",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"1",question:"植物哪個構造負責吸引昆蟲來授粉？",options:["花","根","莖","種子"],answer:"花",hint:"蝴蝶和蜜蜂喜歡去的地方。",explanation:"花瓣鮮豔顏色和花蜜吸引昆蟲幫助傳播花粉。"},
{id:"SCI-PL-13",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"4",question:"蕨類和苔蘚跟開花植物最大不同是？",options:["不會開花結果用孢子繁殖","有根莖葉","是綠色的","需要水"],answer:"不會開花結果用孢子繁殖",hint:"蕨類葉背有褐色粉末。",explanation:"蕨類和苔蘚是較原始的植物，不會開花靠釋放孢子來繁殖。"},
{id:"SCI-PL-14",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"2",question:"地瓜是植物哪個部位的變態？",options:["根（塊根）","莖","葉","花"],answer:"根（塊根）",hint:"地瓜從根膨大而來。",explanation:"地瓜是根部膨大儲存養分的塊根。馬鈴薯才是莖（塊莖）。"},
{id:"SCI-PL-15",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"5",question:"森林被稱為「地球之肺」是因為？",options:["大量植物光合作用釋放氧氣吸收二氧化碳","形狀像肺","裡面有很多動物","森林會呼吸"],answer:"大量植物光合作用釋放氧氣吸收二氧化碳",hint:"肺是交換氣體的器官。",explanation:"森林透過大量光合作用吸收CO₂釋放O₂，像肺幫地球交換氣體。"},
{id:"SCI-PL-16",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"3",question:"鬼針草種子有倒鉤刺是利用什麼方式傳播？",options:["動物（附著身上）","風","水","自力彈射"],answer:"動物（附著身上）",hint:"褲子上常看到它。",explanation:"鬼針草種子倒鉤刺能黏附在動物毛皮或人衣服上隨之移動。"},
{id:"SCI-PL-17",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"4",question:"植物白天晚上都呼吸，但只白天光合作用。為什麼？",options:["光合作用需要陽光","呼吸作用需要陽光","晚上沒有二氧化碳","晚上沒有水"],answer:"光合作用需要陽光",hint:"「光」合作用的「光」字是關鍵。",explanation:"光合作用必須有光能才能進行。呼吸作用不需要光所以白天晚上都有。"},
{id:"SCI-PL-18",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"1",question:"種子發芽需要哪三個基本條件？",options:["水分、溫度和空氣","陽光、土壤和肥料","風、雨和雪","花瓣、花粉和蜂蜜"],answer:"水分、溫度和空氣",hint:"泡水放溫暖的地方就會發芽。",explanation:"種子發芽需要適當的水分、溫度和空氣。"},
{id:"SCI-PL-19",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"2",question:"下列何者不是種子傳播的方式？",options:["用根吸水","風力傳播","水力傳播","動物傳播"],answer:"用根吸水",hint:"根吸水是獲取養分不是傳播種子。",explanation:"種子傳播方式：風力、水力、動物、自力彈射等。"},
{id:"SCI-PL-20",subject:"康軒五下自然",category:"第三單元 植物世界面面觀",difficulty:"5",question:"含羞草被碰觸後葉子閉合的原因是？",options:["葉枕細胞水分快速流失膨壓改變","被嚇到了","葉子壞掉了","為了吸收陽光"],answer:"葉枕細胞水分快速流失膨壓改變",hint:"跟植物細胞裡的水壓變化有關。",explanation:"含羞草葉枕細胞受刺激後水分迅速流出膨壓降低葉片因此閉合，是自我保護。"},

// ===== 第四單元 熱的作用與傳播 (20題) =====
{id:"SCI-HT-01",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"1",question:"摸金屬湯匙比木筷子冰涼，是因為金屬什麼能力好？",options:["導熱能力","導電能力","硬度","重量"],answer:"導熱能力",hint:"金屬很快把手上的熱帶走。",explanation:"金屬導熱快迅速帶走手上熱量所以摸起來冰涼。木頭導熱慢變化不明顯。"},
{id:"SCI-HT-02",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"1",question:"熱從溫度高的地方傳向低的地方，對嗎？",options:["對","錯","不一定","看情況"],answer:"對",hint:"熱水會慢慢變涼。",explanation:"熱能永遠從高溫傳向低溫，直到兩者溫度相同（熱平衡）。"},
{id:"SCI-HT-03",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"2",question:"熱的傳播方式不包括下列哪一種？",options:["反射","傳導","對流","輻射"],answer:"反射",hint:"三種是傳導、對流、輻射。",explanation:"熱的三種傳播方式：傳導（接觸）、對流（流體循環）、輻射（電磁波）。"},
{id:"SCI-HT-04",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"2",question:"燒開水時底部水受熱上升冷水下沉形成循環，是哪種傳熱？",options:["對流","傳導","輻射","反射"],answer:"對流",hint:"流體會循環流動。",explanation:"對流是流體受熱密度變小上升，冷的下沉補充形成循環。"},
{id:"SCI-HT-05",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"2",question:"太陽的熱傳到地球是透過什麼方式？",options:["輻射","傳導","對流","風力"],answer:"輻射",hint:"太陽和地球之間是真空。",explanation:"輻射不需要介質，熱能以電磁波形式穿過太空傳到地球。"},
{id:"SCI-HT-06",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"3",question:"鐵軌之間為什麼要留縫隙？",options:["留給熱脹冷縮的空間","方便維修","節省材料","好看"],answer:"留給熱脹冷縮的空間",hint:"夏天很熱鐵軌會膨脹。",explanation:"金屬受熱會膨脹，留縫隙讓鐵軌有膨脹空間否則會彎曲變形。"},
{id:"SCI-HT-07",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"1",question:"冰塊加熱後會變成什麼？",options:["水","蒸氣","空氣","石頭"],answer:"水",hint:"固體受熱會熔化。",explanation:"冰（固態水）受熱到 0°C 以上會熔化成液態的水。"},
{id:"SCI-HT-08",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"3",question:"保溫瓶能保溫是因為利用了什麼？",options:["減少傳導、對流和輻射","加熱瓶內的水","用電保溫","裡面有暖暖包"],answer:"減少傳導、對流和輻射",hint:"真空層、鏡面內壁都在阻擋熱跑掉。",explanation:"保溫瓶雙層玻璃中間真空（防傳導對流），鍍銀（防輻射）。"},
{id:"SCI-HT-09",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"2",question:"水燒開後繼續加熱溫度會繼續升高嗎？",options:["不會維持 100°C","會升到 200°C","會升到 500°C","溫度會下降"],answer:"不會維持 100°C",hint:"水的沸點是 100°C。",explanation:"一般大氣壓下水沸點 100°C，沸騰後溫度不再上升，熱能用來變成水蒸氣。"},
{id:"SCI-HT-10",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"3",question:"冷氣出風口通常裝在房間上方是因為？",options:["冷空氣重會下沉從上方吹可均勻降溫","因為好看","牆壁上方結實","節省空間"],answer:"冷空氣重會下沉從上方吹可均勻降溫",hint:"冷空氣重往下跑暖空氣輕往上升。",explanation:"冷空氣密度大會下沉，從上方送出可利用對流自然循環均勻冷卻房間。"},
{id:"SCI-HT-11",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"4",question:"下列哪種材料隔熱最好？",options:["保麗龍","鋁片","銅棒","鐵板"],answer:"保麗龍",hint:"金屬導熱好所以不適合隔熱。",explanation:"保麗龍內部有大量空氣泡，空氣導熱差所以是良好隔熱材料。"},
{id:"SCI-HT-12",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"1",question:"物質的三態是哪三種？",options:["固態、液態、氣態","紅藍綠","大中小","快中慢"],answer:"固態、液態、氣態",hint:"冰、水、水蒸氣。",explanation:"物質三態可隨溫度改變而互相轉換。"},
{id:"SCI-HT-13",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"4",question:"「蒸發」和「沸騰」有什麼不同？",options:["蒸發在液面緩慢發生，沸騰在液體內部劇烈發生","完全一樣","沸騰比蒸發慢","蒸發需更高溫"],answer:"蒸發在液面緩慢發生，沸騰在液體內部劇烈發生",hint:"晾衣服是蒸發，煮水冒泡泡是沸騰。",explanation:"蒸發在任何溫度都在液面發生；沸騰在達沸點時液體內部劇烈產生氣泡。"},
{id:"SCI-HT-14",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"2",question:"冬天穿多層衣服暖和主要因為？",options:["衣服間空氣層隔熱","衣服會自己發熱","衣服很重","衣服是金屬做的"],answer:"衣服間空氣層隔熱",hint:"空氣是不良導體。",explanation:"衣服不產生熱但多層之間的空氣層是良好隔熱層減少體溫散失。"},
{id:"SCI-HT-15",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"3",question:"金屬湯匙放入熱湯中把手也變燙了是什麼傳熱方式？",options:["傳導","對流","輻射","蒸發"],answer:"傳導",hint:"熱沿著固體直接傳遞。",explanation:"傳導是熱透過物質直接接觸傳遞，從湯端沿金屬傳到手握端。"},
{id:"SCI-HT-16",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"5",question:"鍋子用金屬做但把手用塑膠木頭是因為？",options:["金屬導熱好能快速煮食，塑膠木頭隔熱保護手","顏色搭配好看","金屬比較重","塑膠比較貴"],answer:"金屬導熱好能快速煮食，塑膠木頭隔熱保護手",hint:"利用不同材料導熱能力差異。",explanation:"金屬是熱良導體讓火的熱快速傳食物；塑膠木頭是熱不良導體避免燙手。"},
{id:"SCI-HT-17",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"2",question:"溫度計的原理是利用什麼現象？",options:["熱脹冷縮","光的折射","磁力","電力"],answer:"熱脹冷縮",hint:"裡面液體受熱膨脹會上升。",explanation:"溫度計裡的液體受熱膨脹上升冷卻收縮下降以此測量溫度。"},
{id:"SCI-HT-18",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"4",question:"同室溫下摸瓷磚覺得冷摸地毯覺得暖是因為？",options:["瓷磚導熱快迅速帶走手的熱","瓷磚溫度比較低","地毯會發熱","地毯溫度比較高"],answer:"瓷磚導熱快迅速帶走手的熱",hint:"兩者溫度其實一樣！差別在導熱速度。",explanation:"同溫度下瓷磚導熱快速帶走熱量感覺冷；地毯導熱慢帶走熱量少感覺暖。"},
{id:"SCI-HT-19",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"1",question:"下列哪個現象跟「熱脹冷縮」有關？",options:["夏天電線下垂比冬天多","冰塊浮水上","下雨地面濕","風吹樹葉動"],answer:"夏天電線下垂比冬天多",hint:"夏天熱電線會膨脹變長。",explanation:"夏天溫度高金屬電線受熱膨脹變長而下垂。"},
{id:"SCI-HT-20",subject:"康軒五下自然",category:"第四單元 熱的作用與傳播",difficulty:"5",question:"露水是空氣中水蒸氣遇冷凝結在草葉上形成的，這叫？",options:["凝結（液化）","蒸發","沸騰","昇華"],answer:"凝結（液化）",hint:"氣態變成液態。",explanation:"凝結是氣態物質遇冷變成液態。水蒸氣遇冰冷草葉表面凝結成水滴。"}
];

writeFileSync("./src/app/quiz/data.json", JSON.stringify(questions, null, 0));

const cats = {};
questions.forEach(q => { cats[q.category] = (cats[q.category]||0)+1; });
const diffs = {};
questions.forEach(q => { diffs[q.difficulty] = (diffs[q.difficulty]||0)+1; });
console.log("Total:", questions.length);
Object.entries(cats).forEach(([k,v]) => console.log(k, v));
console.log("Difficulty:", JSON.stringify(diffs));
