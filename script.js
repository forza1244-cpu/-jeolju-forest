const BASE_W = 350.56;
const BASE_H = 760;
const records = JSON.parse(localStorage.getItem("records") || "{}");
const answers = JSON.parse(localStorage.getItem("answers") || "[]");
const goals = JSON.parse(localStorage.getItem("monthlyGoals") || "{}");
const goalEditCounts = JSON.parse(localStorage.getItem("goalEditCounts") || "{}");
const DRINK_BASE = {
  "소주": { price: 1000, kcal: 90 },
  "맥주": { price: 4000, kcal: 190 },
  "와인": { price: 10000, kcal: 120 },
  "막걸리": { price: 2000, kcal: 150 },
  "하이볼": { price: 9000, kcal: 220 },
  "칵테일": { price: 12000, kcal: 250 },
  "기타": { price: 6333, kcal: 170 }
};

const RECOVERY_CARDS = [
  {
    title: "3일 쉬어가기",
    text: "술을 마신 뒤, 적어도 3일은 \n술 없는 날로 쉬어가는 것이 권장돼요. \n과음의 빈도기준: 일주일에 2회 이상",
    source: "질병관리청 국가건강정보포털 · 보건복지부 절주실천수칙"
  },
  {
    title: "잠들기 전 술은 숙면을 방해해요",
    text: "술을 마시면 처음에는 잠이 잘 오는 것처럼 느껴질 수 있지만,\n몸이 알코올을 분해하는 과정에서 \n자주 깨거나 얕은 잠에 머물 수 있어요.\n과음은 수면의 질과 수면 시간을 줄이고,\n늦은 시간 음주는 수면 중 호흡에도 영향을 줄 수 있어요.",
    source: "질병관리청 국가건강정보포털"
  },
  {
    title: "간에게 쉬는 시간",
    text: "간은 술을 처리하느라 많은 일을 해요.\n반복적인 과음은 간에 지방이 쌓이는 \n지방간으로 이어질 수 있어요.",
    source: "질병관리청 국가건강정보포털"
  },
  {
    title: "해장술보다 회복 시간",
    text: "숙취는 알코올 분해 과정에서 생기는 \n아세트알데하이드와 관련이 있어요.\n해장술은 증상을 잠시 가릴 수 있지만 \n간에 부담을 더하고 회복을 늦출 수 있어요.",
    source: "질병관리청 국가건강정보포털"
  }
];

const MONTH_MIN = 6;
const MONTH_MAX = 10;
let current = new Date(2026, MONTH_MIN, 1);
let selectedKey = "";
let selectedStatus = "";
let currentQuestion = "";

const QUESTION_BY_DATE = {
  "2026-07-06": "오늘 술을 줄이기 위해 가장 먼저 피할 수 있는 상황은 무엇인가요?",
  "2026-07-07": "내일의 나를 위해 오늘 술 대신 선택할 수 있는 행동은 무엇인가요?",
  "2026-07-08": "술 대신 선택할 수 있는 작은 행동은 무엇인가요?",
  "2026-07-09": "술을 거절하기 어려운 분위기를 벗어날 수 있는 나만의 팁이 있다면?",
  "2026-07-10": "술을 마시지 않고 대신 선택할 수 있는 행동이 있다면?",
  "2026-07-11": "월요일을 준비하며 절주하는 이유를 써볼까요?",
  "2026-07-12": "몸이 피곤하다고 느낄 때에도 술을 마셔본 경험이 있나요? 결과는 어땠나요?",
  "2026-07-13": "주로 어떤 상황에서 술을 마시게 되나요?",
  "2026-07-14": "친구의 술 권유를 받았을 때 거절하는 나의 팁은?",
  "2026-07-15": "내일 아침의 내가 고마워할 선택은 무엇인가요?",
  "2026-07-16": "술 없이도 기분을 바꿀 수 있는 방법은 무엇인가요?",
  "2026-07-17": "내일 아침의 컨디션을 생각했을 때 술 대신 선택할 수 있는 작은 행동은 무엇인가요?",
  "2026-07-18": "주말 동안 술을 마시지 않았을 때 좋은 점은 무엇인가요?",
  "2026-07-19": "집에 돌아온 뒤 저녁 시간을 건강하게 보내는 나만의 방법이 있나요?",
  "2026-07-20": "기분 좋은 일이 있었을 때 술 없이도 기분을 낼 수 있는 방법이 있다면?",
  "2026-07-21": "나만의 논 알코올 음료는?",
  "2026-07-22": "나를 칭찬해주고 싶은 날! 내가 나에게 해줄 수 있는 소확행 보상은 무엇인가요?",
  "2026-07-23": "약속에서 술을 마시지 않았을 때 제일 좋았던 점은?",
  "2026-07-24": "술의 가장 큰 단점이 무엇이라고 생각하나요?",
  "2026-07-25": "잠들기 전, 내가 지키고 싶은 약속 하나는 무엇인가요?",
  "2026-07-26": "술자리를 앞두고 있을 때, 절주 다짐을 한 적이 있나요?",
  "2026-07-27": "스트레스를 많이 받은 날, 술을 마시고 싶은 마음이 사라지게 하려면 무엇을 해볼 수 있나요?",
  "2026-07-28": "오늘 술을 마시고 싶지 않은 이유를 한 문장으로 쓰면 무엇인가요?",
  "2026-07-29": "어떤 술을 마셨을 때 제일 후폭풍이 컸나요?",
  "2026-07-30": "건강한 술자리를 위해 노력했던 경험이 있나요?",
  "2026-07-31": "술을 마시지 않았을 때 얻을 수 있는 가장 큰 이득은 무엇인가요?",
  "2026-08-01": "몸이 피곤하다고 느낄 때 술을 마셨던 경험이 있나요?",
  "2026-08-02": "혼자 있는 시간이 길어질 때 술 없이도 기분을 바꿀 수 있는 방법은 무엇인가요?",
  "2026-08-03": "친구와의 약속에서 술 대신 선택할 수 있는 요소는 무엇이 있을까요?",
  "2026-08-04": "오늘 하루를 정리하면서 내가 나에게 해줄 수 있는 가장 다정한 말은 무엇인가요?",
  "2026-08-05": "습관처럼 술을 마시고 싶어질 때 지금 마음을 지나가게 하려면 무엇을 해볼 수 있나요?",
  "2026-08-06": "내일 아침의 나를 생각하며 오늘 마시고 싶은 이유를 한 문장으로 쓰면 무엇인가요?",
  "2026-08-07": "주말을 시작하며 이번 주말에 이루고 싶은 목표를 하나 정해본다면?",
  "2026-08-08": "집에 돌아온 뒤 쉬고 싶을 때 해야 할 일들을 끝낼 수 있는 나만의 팁이 있다면?",
  "2026-08-09": "기분 좋은 일이 있었을 때 축하하는 나만의 방법은?",
  "2026-08-10": "술을 많이 마셔 힘들었던 경험이 있었나요?",
  "2026-08-11": "나와 제일 안 맞다고 생각되는 주종은?",
  "2026-08-12": "술을 안 마셨을 때 돈을 크게 아꼈던 적이 있나요?",
  "2026-08-13": "내 건강을 떠올리며 마시지 않았을 때 얻을 수 있는 가장 큰 이득은 무엇인가요?",
  "2026-08-14": "잠이 오지 않아 술을 마셨던 경험이 있나요?",
  "2026-08-15": "나의 주량을 잘 알고 있나요?",
  "2026-08-16": "어떤 주종을 제일 선호하나요? 이유는 뭔가요?",
  "2026-08-17": "겪었던 가장 큰 숙취는 무엇인가요?",
  "2026-08-18": "술을 가장 자주 마시는 요일은 언제인가요?",
  "2026-08-19": "내가 술을 마시는 습관은 건강한 편이라고 생각하나요?",
  "2026-08-20": "절주를 시작한 가장 큰 이유는 무엇인가요?",
  "2026-08-21": "앞으로 가장 바꾸고 싶은 음주습관은?",
  "2026-08-22": "절주에 성공하면 가장 기대되는 변화는 무엇인가요?",
  "2026-08-23": "절주를 계속하고 싶은 이유를 한 가지 적어볼까요?",
  "2026-08-24": "술을 권유받으면 쉽게 거절할 수 있나요?",
  "2026-08-25": "절주 후 피로감이 줄어들었나요?",
  "2026-08-26": "오늘 물은 충분히 마셨나요?",
  "2026-08-27": "오늘 술을 마시고 싶었던 순간이 있었나요?",
  "2026-08-28": "나에게 가장 큰 동기부여는 무엇인가요?",
  "2026-08-29": "미래의 나에게 한마디를 남겨보세요!",
  "2026-08-30": "절주를 응원해주는 사람이 있나요?",
  "2026-08-31": "이번 달 가장 자랑스러운 절주 순간은 언제였나요?",
  "2026-09-01": "술을 줄이면 내 수면 패턴에 어떤 변화가 생길 것 같나요?",
  "2026-09-02": "최근 술을 마신 다음 날, 몸에서 가장 먼저 느껴진 변화는 무엇이었나요?",
  "2026-09-03": "오늘 내 간에게 쉬는 시간을 준다면 어떤 선택을 해볼 수 있을까요?",
  "2026-09-04": "술자리 전에 식사를 챙기면 내 음주량에 어떤 도움이 될까요?",
  "2026-09-05": "술을 마시고 싶은 마음이 들 때, 내 몸은 실제로 무엇을 필요로 하고 있을까요?",
  "2026-09-06": "최근 숙취가 있었던 날, 하루 생활에 어떤 영향을 받았나요?",
  "2026-09-07": "술을 줄이면 아침 시간을 어떻게 더 잘 사용할 수 있을까요?",
  "2026-09-08": "오늘 내 몸을 위해 가장 먼저 챙기고 싶은 건강 습관은 무엇인가요?",
  "2026-09-09": "늦은 시간 음주가 내 잠에 어떤 영향을 줬던 적이 있나요?",
  "2026-09-10": "술 없는 저녁을 보낸다면 내일 컨디션은 어떻게 달라질까요?",
  "2026-09-11": "술을 마신 뒤 속이 불편했던 경험이 있다면, 그때 무엇이 도움이 되었나요?",
  "2026-09-12": "술자리에서 천천히 마시기 위해 내가 사용할 수 있는 방법은 무엇인가요?",
  "2026-09-13": "이번 주 내 몸이 가장 피곤했던 순간은 언제였고, 술과 관련이 있었나요?",
  "2026-09-14": "술을 줄이면 내 피부나 얼굴 붓기에 어떤 변화가 있을 것 같나요?",
  "2026-09-15": "스트레스를 술이 아닌 방식으로 풀었을 때 가장 좋았던 경험은 무엇인가요?",
  "2026-09-16": "오늘 술을 줄이면 내 몸이 가장 고마워할 부분은 어디일까요?",
  "2026-09-17": "술을 마시기 전과 후의 기분 차이를 떠올리면 어떤 점이 보이나요?",
  "2026-09-18": "숙취를 줄이기 위해 술자리 전후로 실천하고 싶은 습관은 무엇인가요?",
  "2026-09-19": "술 없는 하루가 내 집중력에 어떤 도움을 줄 수 있을까요?",
  "2026-09-20": "오늘 내 건강을 위해 ‘덜 마시기’ 말고 함께 실천할 수 있는 것은 무엇인가요?",
  "2026-09-21": "반복되는 음주 습관 중 내 몸에 가장 부담이 되는 부분은 무엇인가요?",
  "2026-09-22": "술을 줄였을 때 가장 먼저 회복되었으면 하는 몸 상태는 무엇인가요?",
  "2026-09-23": "술자리 다음 날의 계획을 지키기 위해 오늘 조절할 수 있는 것은 무엇인가요?",
  "2026-09-24": "내가 술을 마실 때 자주 놓치는 건강 신호는 무엇인가요?",
  "2026-09-25": "술을 줄이면 내 운동이나 산책 습관에 어떤 도움이 될까요?",
  "2026-09-26": "오늘은 내 몸에게 어떤 휴식을 선물하고 싶나요?",
  "2026-09-27": "술을 마신 뒤 잠을 자도 개운하지 않았던 경험이 있나요?",
  "2026-09-28": "술을 권하는 상황에서 내 건강을 지키기 위해 어떤 말을 해볼 수 있을까요?",
  "2026-09-29": "술 없는 저녁을 보내면 남는 시간으로 무엇을 해보고 싶나요?",
  "2026-09-30": "이번 달 절주가 내 건강에 준 가장 작은 변화는 무엇인가요?",
  "2026-10-01": "이번 달에는 내 몸을 위해 어떤 절주 목표를 세우고 싶나요?",
  "2026-10-02": "술을 줄이면 식사 습관에도 변화가 생길 수 있을까요?",
  "2026-10-03": "술자리에서 물을 함께 마시는 습관을 들인다면 어떤 점이 좋을까요?",
  "2026-10-04": "숙취 때문에 놓쳤던 하루가 있다면, 그때 가장 아쉬웠던 점은 무엇인가요?",
  "2026-10-05": "술을 마시고 싶은 마음이 올라올 때 몸의 피로와 감정을 구분할 수 있나요?",
  "2026-10-06": "술 없는 밤을 보내기 위해 잠들기 전 어떤 루틴을 만들어보고 싶나요?",
  "2026-10-07": "내 간을 쉬게 하는 날을 만든다면 일주일 중 언제가 좋을까요?",
  "2026-10-08": "술을 줄이면 다음 날 가장 먼저 좋아질 것 같은 일상은 무엇인가요?",
  "2026-10-09": "건강한 술자리를 위해 미리 정해두고 싶은 나만의 기준은 무엇인가요?",
  "2026-10-10": "과음하지 않기 위해 술자리 시작 전에 스스로에게 해줄 말은 무엇인가요?",
  "2026-10-11": "술을 줄이면 내 감정 기복에 어떤 변화가 있을 것 같나요?",
  "2026-10-12": "최근 몸이 보내는 피로 신호를 무시한 적이 있나요?",
  "2026-10-13": "술 대신 따뜻한 차나 물을 선택한다면 어떤 순간에 가장 도움이 될까요?",
  "2026-10-14": "술자리에서 분위기보다 내 컨디션을 먼저 생각한 적이 있나요?",
  "2026-10-15": "술을 마신 다음 날 식욕이나 식사 패턴이 달라진 적이 있나요?",
  "2026-10-16": "오늘의 컨디션을 1점부터 10점까지 준다면 몇 점인가요? 이유는 무엇인가요?",
  "2026-10-17": "술 없는 주말을 보낸다면 내 몸은 어떤 점에서 편안해질까요?",
  "2026-10-18": "내가 술을 줄일수록 더 잘 챙기고 싶은 건강 습관은 무엇인가요?",
  "2026-10-19": "늦은 밤 술자리를 줄이면 다음 날 일정에 어떤 도움이 될까요?",
  "2026-10-20": "술을 마시기 전 ‘오늘은 여기까지만’이라고 정할 수 있는 기준은 무엇인가요?",
  "2026-10-21": "술을 줄인 날, 내 몸에서 가장 긍정적으로 느껴지는 변화는 무엇인가요?",
  "2026-10-22": "술을 줄이면 내가 아끼는 사람들과의 시간은 어떻게 달라질까요?",
  "2026-10-23": "숙취 없이 시작한 하루에 가장 하고 싶은 일은 무엇인가요?",
  "2026-10-24": "내 몸을 혹사시키지 않기 위해 오늘 거절해도 되는 것은 무엇인가요?",
  "2026-10-25": "술자리 후 회복에 오래 걸렸던 경험이 있다면, 다음에는 무엇을 바꾸고 싶나요?",
  "2026-10-26": "술을 줄이는 것이 내 장기적인 건강에 어떤 의미가 있을까요?",
  "2026-10-27": "오늘 내 몸을 더 가볍게 만들 수 있는 선택은 무엇인가요?",
  "2026-10-28": "술을 마시고 싶은 날일수록 먼저 확인해야 할 내 감정은 무엇인가요?",
  "2026-10-29": "술 없는 하루를 보낸 뒤 나에게 주고 싶은 건강한 보상은 무엇인가요?",
  "2026-10-30": "이번 달 절주 기록에서 가장 뿌듯한 건강 변화는 무엇인가요?",
  "2026-10-31": "다음 달에는 내 몸을 위해 어떤 음주 습관을 줄여보고 싶나요?",
  "2026-11-01": "이번 달 절주를 통해 가장 지키고 싶은 건강 목표는 무엇인가요?",
  "2026-11-02": "술을 마시고 난 뒤 내 수면의 질을 돌아보면 어떤 패턴이 보이나요?",
  "2026-11-03": "내 몸이 피곤하다는 신호를 보낼 때 술보다 먼저 필요한 것은 무엇일까요?",
  "2026-11-04": "술자리에서 내 페이스를 지키기 위해 정해두고 싶은 규칙은 무엇인가요?",
  "2026-11-05": "술을 줄이면 아침 루틴을 어떻게 더 건강하게 만들 수 있을까요?",
  "2026-11-06": "간을 쉬게 하는 날을 꾸준히 만들기 위해 필요한 환경은 무엇인가요?",
  "2026-11-07": "술을 줄이는 것이 내 체력 관리에 어떤 도움을 줄 수 있을까요?",
  "2026-11-08": "오늘 나에게 필요한 것은 술인지, 휴식인지, 대화인지 구분해볼 수 있나요?",
  "2026-11-09": "숙취 없는 하루가 내 기분에 주는 가장 큰 장점은 무엇인가요?",
  "2026-11-10": "술자리 전 미리 먹거나 챙기면 좋을 건강한 선택은 무엇인가요?",
  "2026-11-11": "술을 마신 뒤 후회가 남았던 날, 다음에는 어떤 선택을 해보고 싶나요?",
  "2026-11-12": "술을 줄이면 내 몸의 회복 속도에 어떤 차이가 생길 것 같나요?",
  "2026-11-13": "오늘의 스트레스를 건강하게 내려놓기 위해 할 수 있는 일은 무엇인가요?",
  "2026-11-14": "술 없는 밤을 보내면 내일 아침 가장 기대되는 점은 무엇인가요?",
  "2026-11-15": "내가 건강한 음주 습관을 만들고 있다고 느끼는 순간은 언제인가요?",
  "2026-11-16": "술을 줄이기 위해 주변 사람에게 부탁하고 싶은 배려가 있나요?",
  "2026-11-17": "술을 마실 때보다 마시지 않았을 때 더 잘 느껴지는 몸의 변화는 무엇인가요?",
  "2026-11-18": "오늘은 내 몸의 어떤 부분을 더 아껴주고 싶나요?",
  "2026-11-19": "술자리 후 늦게 자는 습관을 줄이기 위해 어떤 약속을 정할 수 있을까요?",
  "2026-11-20": "술을 줄이면 내가 더 오래 유지하고 싶은 생활 리듬은 무엇인가요?",
  "2026-11-21": "내 건강을 위해 이번 주에 만들고 싶은 무음주일은 언제인가요?",
  "2026-11-22": "술을 마시지 않은 날의 기분과 마신 날의 기분은 어떻게 다른가요?",
  "2026-11-23": "술을 줄이는 과정에서 가장 어려운 몸의 신호나 감정은 무엇인가요?",
  "2026-11-24": "건강한 회복을 위해 오늘 잠들기 전 줄이고 싶은 습관은 무엇인가요?",
  "2026-11-25": "술 없는 날이 쌓이면 내 일상에서 무엇이 가장 좋아질까요?",
  "2026-11-26": "내가 절주를 통해 얻고 싶은 건강한 이미지는 어떤 모습인가요?",
  "2026-11-27": "술을 줄이면서 더 자주 느끼고 싶은 몸의 상태는 무엇인가요?",
  "2026-11-28": "이번 달 나의 절주 기록이 내 건강을 어떻게 보여주고 있나요?",
  "2026-11-29": "절주를 계속 이어가기 위해 12월의 나에게 남기고 싶은 건강 약속은 무엇인가요?",
  "2026-11-30": "지난 몇 달 동안 절주를 통해 내 몸과 마음이 달라진 점은 무엇인가요?"
};

const QUESTION_START = new Date(2026, 6, 8);
const QUESTION_END = new Date(2026, 10, 30);
const questionContexts = [
  "술 생각이 올라오는 순간에",
  "저녁 시간이 가까워질 때",
  "친구의 권유를 받았을 때",
  "스트레스를 많이 받은 날에",
  "기분 좋은 일이 있었을 때",
  "혼자 있는 시간이 길어질 때",
  "술자리를 앞두고 있을 때",
  "집에 돌아온 뒤 쉬고 싶을 때",
  "몸이 피곤하다고 느낄 때",
  "잠들기 전 허전함이 생길 때",
  "주말을 시작하는 마음으로",
  "월요일을 준비하는 마음으로",
  "내 건강을 떠올리며",
  "내일 아침의 나를 생각하며",
  "가족이나 가까운 사람을 떠올리며",
  "돈과 시간을 아끼고 싶은 마음으로",
  "습관처럼 마시고 싶어질 때",
  "거절하기 어려운 분위기에서",
  "나를 칭찬해주고 싶은 날에",
  "오늘 하루를 정리하면서"
];
const questionActions = [
  "술 대신 선택할 수 있는 작은 행동은 무엇인가요?",
  "내가 나에게 해줄 수 있는 가장 다정한 말은 무엇인가요?",
  "마시지 않았을 때 얻을 수 있는 가장 큰 이득은 무엇인가요?",
  "지금 마음을 10분만 지나가게 하려면 무엇을 해볼 수 있나요?",
  "내일 아침의 내가 고마워할 선택은 무엇인가요?",
  "오늘 마시고 싶은 이유를 한 문장으로 쓰면 무엇인가요?",
  "술 없이도 기분을 바꿀 수 있는 방법은 무엇인가요?",
  "내가 지키고 싶은 약속 하나는 무엇인가요?"
];

function dailyQuestionInfo(date = new Date()) {
  const day = startOfDay(date);
  const key = keyOf(day.getFullYear(), day.getMonth(), day.getDate());
  const question = QUESTION_BY_DATE[key];
  if (question) return { status: "active", index: -1, question };
  if (key < "2026-07-06") return { status: "before" };
  return { status: "after" };
}

const $ = (id) => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");
const keyOf = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const monthKeyOf = (y, m) => `${y}-${pad(m + 1)}`;
const todayKey = () => {
  const d = new Date();
  return keyOf(d.getFullYear(), d.getMonth(), d.getDate());
};
const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const yoil = ["일", "월", "화", "수", "목", "금", "토"];

function fitStage() {
  const isDesktopPreview = window.innerWidth > 700;
  const viewport = window.visualViewport;
  const viewportWidth = viewport?.width || window.innerWidth;
  const viewportHeight = viewport?.height || window.innerHeight;
  const widthScale = viewportWidth / BASE_W;
  const containScale = Math.min(widthScale, viewportHeight / BASE_H);
  const scale = isDesktopPreview ? Math.min(containScale, 1.15) : widthScale;
  const scaledHeight = BASE_H * scale;

  const navTop = viewportHeight / scale - 742;

  document.documentElement.style.setProperty("--scale", String(scale));
  document.documentElement.style.setProperty("--stage-height", scaledHeight + "px");
  document.documentElement.style.setProperty("--viewport-height", viewportHeight + "px");
  document.documentElement.style.setProperty("--nav-top", navTop + "px");
}
window.addEventListener("resize", fitStage);
window.addEventListener("orientationchange", fitStage);
window.visualViewport?.addEventListener("resize", fitStage);
window.visualViewport?.addEventListener("scroll", fitStage);

function fmt(keyOrIso) {
  const d = keyOrIso.includes("T")
    ? new Date(keyOrIso)
    : (() => {
        const [y, m, dd] = keyOrIso.split("-").map(Number);
        return new Date(y, m - 1, dd);
      })();
  return `${d.getMonth() + 1}. ${d.getDate()}. (${yoil[d.getDay()]})`;
}

function esc(s = "") {
  return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function formatWon(value) {
  return `${Number(value || 0).toLocaleString("ko-KR")}원`;
}

function formatKcal(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("ko-KR")}kcal`;
}

function saveRecords() { localStorage.setItem("records", JSON.stringify(records)); }
function saveAnswers() { localStorage.setItem("answers", JSON.stringify(answers)); }
function saveGoals() { localStorage.setItem("monthlyGoals", JSON.stringify(goals)); }
function saveGoalEditCounts() { localStorage.setItem("goalEditCounts", JSON.stringify(goalEditCounts)); }
function currentMonthKey() { return monthKeyOf(current.getFullYear(), current.getMonth()); }
function realMonthKey() {
  const today = new Date();
  return monthKeyOf(today.getFullYear(), today.getMonth());
}
function isViewingRealMonth() { return currentMonthKey() === realMonthKey(); }
function hasGoalForMonth(key) { return goals[key] !== undefined && goals[key] !== ""; }

function updateGoalText() {
  const value = goals[currentMonthKey()];
  const goal = value !== undefined && value !== "" ? Number(value) : 0;
  $("goalText").textContent = `목표: ${goal}잔`;
  if ($("goalValue")) $("goalValue").textContent = `${goal}잔`;
  $("goalLeafButton").disabled = !isViewingRealMonth();
}

function openGoalModal() {
  if (!isViewingRealMonth()) return;
  const key = currentMonthKey();
  const month = current.getMonth() + 1;
  const hasGoal = hasGoalForMonth(key);
  const editCount = Number(goalEditCounts[key] || 0);
  const remaining = Math.max(0, 1 - editCount);
  const locked = hasGoal && remaining <= 0;
  $("goalModalTitle").textContent = `${current.getFullYear()}년 ${month}월 목표 잔 수`;
  $("goalInput").value = goals[key] ?? "";
  $("goalInput").disabled = locked;
  $("saveGoal").disabled = locked;
  $("goalHelp").textContent = locked
    ? "남은 수정 횟수 : 0번"
    : `남은 수정 횟수 : ${remaining}번`;
  $("goalModal").classList.remove("hidden");
  if (!locked) setTimeout(() => $("goalInput").focus(), 50);
}

function ensureGoal() {
  updateGoalText();
}

$("goalLeafButton").onclick = openGoalModal;
$("closeGoalModal").onclick = () => $("goalModal").classList.add("hidden");

$("saveGoal").onclick = () => {
  const raw = $("goalInput").value.trim();
  if (raw === "" || Number(raw) < 0 || Number(raw) > 30) {
    alert("목표 잔 수를 0잔 이상 30잔 이하로 입력해줘!");
    return;
  }
  const key = currentMonthKey();
  const nextGoal = Number(raw);
  const hasGoal = hasGoalForMonth(key);
  const previousGoal = hasGoal ? Number(goals[key]) : null;
  const changed = !hasGoal || previousGoal !== nextGoal;
  const editCount = Number(goalEditCounts[key] || 0);

  if (hasGoal && changed && editCount >= 1) {
    alert("이 달 목표 수정은 1번까지 가능해요.");
    openGoalModal();
    return;
  }

  goals[key] = nextGoal;
  if (hasGoal && changed) {
    goalEditCounts[key] = editCount + 1;
    saveGoalEditCounts();
  }
  saveGoals();
  $("goalModal").classList.add("hidden");
  updateGoalText();
  renderStats();
};

function renderCalendar() {
  const y = current.getFullYear();
  const m = current.getMonth();

  $("monthImage").src = `./assets/month-${pad(m + 1)}.png`;
  $("monthImage").alt = `${y}년 ${m + 1}월`;

  $("prevMonth").disabled = m <= MONTH_MIN;
  $("nextMonth").disabled = m >= MONTH_MAX;

  const grid = $("calendarGrid");
  grid.innerHTML = "";

  const first = new Date(y, m, 1).getDay();
  const last = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  const todayStart = startOfDay(today);

  for (let i = 0; i < first; i++) {
    const b = document.createElement("button");
    b.className = "day empty";
    b.disabled = true;
    grid.appendChild(b);
  }

  for (let d = 1; d <= last; d++) {
    const k = keyOf(y, m, d);
    const b = document.createElement("button");
    b.className = "day";
    b.textContent = d;

    if (records[k]?.status === "none") b.classList.add("none");
    if (records[k]?.status === "drink") b.classList.add("drink");

    if (today.getFullYear() === y && today.getMonth() === m && today.getDate() === d) {
      b.classList.add("today");
    }

    if (new Date(y, m, d) > todayStart) {
      b.classList.add("future");
      b.disabled = true;
      b.setAttribute("aria-label", `${m + 1}월 ${d}일은 당일이 되어야 기록할 수 있어요`);
    } else {
      b.onclick = () => openRecord(k, m + 1, d);
    }
    grid.appendChild(b);
  }

  updateGoalText();
  renderStats();
  setTimeout(ensureGoal, 150);
}

$("prevMonth").onclick = () => {
  if (current.getMonth() <= MONTH_MIN) return;
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
};

$("nextMonth").onclick = () => {
  if (current.getMonth() >= MONTH_MAX) return;
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
};

function openRecord(k, month, day) {
  selectedKey = k;
  const r = records[k] || {};
  selectedStatus = r.status || "";

  $("recordTitle").textContent = `${month}월 ${day}일 기록`;
  $("drinkType").value = r.type || "소주";
  $("otherDrinkName").value = r.otherType || "";
  $("drinkAmount").value = r.amount || "";
  $("drinkMemo").value = r.memo || "";

  toggleOtherDrinkField();
  $("drinkFields").classList.toggle("hidden", r.status !== "drink");
  $("noDrinkBtn").classList.toggle("active", r.status === "none");
  $("drinkBtn").classList.toggle("active", r.status === "drink");
  $("recordModal").classList.remove("hidden");
}

function toggleOtherDrinkField() {
  $("otherDrinkWrap").classList.toggle("hidden", $("drinkType").value !== "기타");
}

$("drinkType").onchange = toggleOtherDrinkField;

$("noDrinkBtn").onclick = () => {
  selectedStatus = "none";
  $("drinkFields").classList.add("hidden");
  $("noDrinkBtn").classList.add("active");
  $("drinkBtn").classList.remove("active");
};

$("drinkBtn").onclick = () => {
  selectedStatus = "drink";
  $("drinkFields").classList.remove("hidden");
  toggleOtherDrinkField();
  $("drinkBtn").classList.add("active");
  $("noDrinkBtn").classList.remove("active");
};

$("saveRecord").onclick = () => {
  if (!selectedStatus) {
    alert("먼저 마셨는지 선택해줘!");
    return;
  }

  const amount = Math.max(1, Number($("drinkAmount").value || 1));

  records[selectedKey] = selectedStatus === "none"
    ? { status: "none", amount: 0, memo: $("drinkMemo").value.trim() }
    : {
        status: "drink",
        type: $("drinkType").value,
        otherType: $("drinkType").value === "기타" ? $("otherDrinkName").value.trim() : "",
        amount,
        memo: $("drinkMemo").value.trim()
      };

  saveRecords();
  $("recordModal").classList.add("hidden");
  renderCalendar();
};

$("closeModal").onclick = () => $("recordModal").classList.add("hidden");

function switchView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === id));
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === id));
  if (id === "bookshelfView") showShelf();
  if (id === "statsView") renderStats();
  if (id === "homeView") setTimeout(ensureGoal, 100);
}

document.querySelectorAll(".tab").forEach(t => {
  t.onclick = () => switchView(t.dataset.view);
});

function showShelf() {
  $("bookshelfHome").classList.remove("hidden");
  $("randomScreen").classList.add("hidden");
  $("answersScreen").classList.add("hidden");
  $("memosScreen").classList.add("hidden");
}

document.querySelectorAll(".back-shelf").forEach(b => {
  b.onclick = showShelf;
});

document.querySelectorAll(".book-card").forEach(b => {
  b.onclick = () => {
    $("bookshelfHome").classList.add("hidden");
    if (b.dataset.book === "random") {
      pickQuestion();
      $("randomScreen").classList.remove("hidden");
    }
    if (b.dataset.book === "answers") {
      renderAnswers();
      $("answersScreen").classList.remove("hidden");
    }
    if (b.dataset.book === "memos") {
      renderMemos();
      $("memosScreen").classList.remove("hidden");
    }
  };
});

function answeredToday() {
  return answers.find(a => a.dateKey === todayKey());
}

function pickQuestion() {
  const old = answeredToday();
  const save = $("saveAnswer");
  const change = $("changeQuestion");
  const input = $("answerInput");
  const info = dailyQuestionInfo();

  change.classList.add("hidden");
  change.disabled = true;

  if (old) {
    currentQuestion = old.question;
    $("dailyNotice").textContent = "오늘은 이미 질문에 답변했어요. 내일 새로운 질문을 만나봐요.";
    $("questionText").textContent = old.question;
    input.value = old.answer;
    input.disabled = true;
    save.disabled = true;
    $("answerCount").textContent = input.value.length;
    return;
  }

  if (info.status === "before") {
    currentQuestion = "";
    $("dailyNotice").textContent = "오늘의 질문은 2026년 7월 8일부터 시작돼요.";
    $("questionText").textContent = "7월 8일에 첫 질문이 열려요.";
    input.value = "";
    input.disabled = true;
    save.disabled = true;
    $("answerCount").textContent = 0;
    return;
  }

  if (info.status === "after") {
    currentQuestion = "";
    $("dailyNotice").textContent = "오늘의 질문 기간이 종료되었어요.";
    $("questionText").textContent = "2026년 11월 30일까지의 질문 기록을 확인해보세요.";
    input.value = "";
    input.disabled = true;
    save.disabled = true;
    $("answerCount").textContent = 0;
    return;
  }

  currentQuestion = info.question;
  $("dailyNotice").textContent = "오늘의 질문은 하루에 1개만 저장할 수 있어요.";
  $("questionText").textContent = currentQuestion;
  input.value = "";
  input.disabled = false;
  save.disabled = false;
  $("answerCount").textContent = 0;
}

$("changeQuestion").onclick = () => {};
$("answerInput").oninput = () => $("answerCount").textContent = $("answerInput").value.length;

$("saveAnswer").onclick = () => {
  if (answeredToday()) {
    alert("오늘은 이미 답변했어요.");
    return;
  }
  const text = $("answerInput").value.trim();
  if (!text) {
    alert("답변을 입력해줘!");
    return;
  }
  answers.push({
    dateKey: todayKey(),
    question: currentQuestion,
    answer: text,
    createdAt: new Date().toISOString()
  });
  saveAnswers();
  renderAnswers();
  $("randomScreen").classList.add("hidden");
  $("answersScreen").classList.remove("hidden");
};

function renderAnswers() {
  const list = $("answerList");
  list.innerHTML = "";
  if (!answers.length) {
    list.innerHTML = '<div class="item">아직 저장된 답변이 없어요.</div>';
    return;
  }
  [...answers].reverse().forEach(a => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<b>${fmt(a.createdAt)}</b><strong>${esc(a.question)}</strong><p>${esc(a.answer)}</p>`;
    list.appendChild(div);
  });
}

function renderMemos() {
  const list = $("memoList");
  list.innerHTML = "";
  const memos = Object.entries(records)
    .filter(([k, r]) => r.memo)
    .sort(([a], [b]) => b.localeCompare(a));

  if (!memos.length) {
    list.innerHTML = '<div class="item">아직 캘린더 메모가 없어요.</div>';
    return;
  }

  memos.forEach(([k, r]) => {
    const div = document.createElement("div");
    const amount = r.status === "drink" ? Math.max(1, Number(r.amount || 1)) : 0;
    const typeLabel = r.type === "기타" && r.otherType ? r.otherType : (r.type || "술");
    const title = r.status === "none" ? "무음주일" : `${typeLabel} ${amount}잔`;
    div.className = "item";
    div.innerHTML = `<b>${fmt(k)} · ${esc(title)}</b><p>${esc(r.memo)}</p>`;
    list.appendChild(div);
  });
}

function renderRecoveryCards() {
  const wrap = $("recoveryCards");
  if (!wrap) return;
  wrap.innerHTML = "";

  RECOVERY_CARDS.forEach(card => {
    const item = document.createElement("article");
    item.className = "recovery-card";

    const title = document.createElement("strong");
    title.className = "recovery-card-title";
    title.textContent = card.title;

    const text = document.createElement("p");
    text.className = "recovery-text";
    text.innerHTML = card.text.includes("\n")
      ? card.text.replace(/\n/g, "<br>")
      : card.text.replace(/\.\s+/g, ".<br>");
    item.append(title, text);
    wrap.appendChild(item);
  });
}

function renderStats() {
  renderRecoveryCards();
  const y = current.getFullYear();
  const m = current.getMonth();
  let noDrink = 0;
  let drink = 0;
  let total = 0;
  let estimatedMoney = 0;
  let estimatedKcal = 0;

  Object.entries(records).forEach(([k, r]) => {
    const [yy, mm] = k.split("-").map(Number);
    if (yy !== y || mm !== m + 1) return;
    if (r.status === "none") noDrink++;
    if (r.status === "drink") {
      const amount = Math.max(1, Number(r.amount || 1));
      const base = DRINK_BASE[r.type] || DRINK_BASE["기타"];
      drink++;
      total += amount;
      estimatedMoney += base.price * amount;
      estimatedKcal += base.kcal * amount;
    }
  });

  $("noDrinkDays").textContent = noDrink;
  $("drinkDays").textContent = drink;
  $("totalDrinks").textContent = total;

  const goal = goals[currentMonthKey()];
  const hasGoal = goal !== undefined && goal !== "";
  const goalValue = hasGoal ? Number(goal) : 0;
  if ($("goalValue")) $("goalValue").textContent = `${goalValue}잔`;
  $("remainDrinks").textContent = `${Math.max(0, goalValue - total)}잔`;
  if ($("estimatedMoney")) $("estimatedMoney").textContent = formatWon(estimatedMoney);
  if ($("estimatedKcal")) $("estimatedKcal").textContent = formatKcal(estimatedKcal);

  const savedCups = hasGoal ? Math.max(0, goalValue - total) : 0;
  const savingCard = $("savingEstimateCard");
  if (savingCard) {
    savingCard.classList.toggle("hidden", savedCups <= 0);
    $("savedMoney").textContent = formatWon(savedCups * DRINK_BASE["기타"].price);
    $("savedKcal").textContent = formatKcal(savedCups * DRINK_BASE["기타"].kcal);
  }
}

fitStage();
renderCalendar();






