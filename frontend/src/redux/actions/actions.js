// 파일 생성자 : 임성준

/* 액션타입 정의영역 - 성준 */

// 캐릭터 - 성준
export const MAIN_CHARACTER = 'MAIN_CHARACTER'

// 애니메이션

// 클라이언트 사이드 메뉴 - 성준
export const INIT_SIDE_MENU = 'INIT_SIDE_MENU'
export const SIDE_MENU_CONSULTATION = 'SIDE_MENU_CONSULTATION'
export const SIDE_MENU_BOARD = 'SIDE_MENU_BOARD'
export const SIDE_MENU_FOOD = 'SIDE_MENU_FOOD'
export const SIDE_MENU_DEPT_REC = 'SIDE_MENU_DEPT_REC'

// 상담신청 - 성준
export const REQ_FOR_CONSULTATION = 'REQ_FOR_CONSULTATION'
export const MY_COUNSEL = 'MY_COUNSEL'
export const COUNSEL_DATE = 'COUNSEL_DATE'
export const REQ_FOR_CONSULTATION_LIST = 'REQ_FOR_CONSULTATION_LIST'
export const COUNSEL_DATE_REGISTER = 'COUNSEL_DATE_REGISTER'

// 맵 - 성준
export const YH_MAP = 'YH_MAP'
export const DEPT_MAP = 'DEPT_MAP'
export const COMPUTER_SOFTWARE_MAP = 'COMPUTER_SOFTWARE_MAP'
export const INDUSTRIAL_DESIGN_MAP = 'INDUSTRIAL_DESIGN_MAP'
export const FOOD_NUTRITION_MAP = 'FOOD_NUTRITION_MAP'
export const YUHAN_LIFE_BIO_MAP = 'YUHAN_LIFE_BIO_MAP'


// 모달 - 성준
export const ADMIN_ENTER_MODAL = 'ADMIN_ENTER_MODAL'
export const INIT_MODAL = 'INIT_MODAL'

// 미니맵 상단 버튼 그룹 - 성준
export const AERIAL_VIEW = 'AERIAL_VIEW'


// 버스 정류장 - 자현
export const ENTER_BUS_STATION_ONE = 'ENTER_BUS_STATION_ONE';
export const LEAVE_BUS_STATION_ONE = 'LEAVE_BUS_STATION_ONE';
export const ENTER_BUS_STATION_TWO = 'ENTER_BUS_STATION_TWO';
export const LEAVE_BUS_STATION_TWO = 'LEAVE_BUS_STATION_TWO';

/* 액션 생성자 정의영역 - 성준 */

// 캐릭터 - 성준
export const mainChar = () => ({
    type: MAIN_CHARACTER
})

// 맵 - 성준
export const yhMap = () => ({
    type: YH_MAP
})
export const deptMap = () => ({
    type: DEPT_MAP
})
export const computerSoftwareMap = () => ({
    type: COMPUTER_SOFTWARE_MAP
})
export const industrialDesignMap = () => ({
    type: INDUSTRIAL_DESIGN_MAP
})
export const foodNutritionMap = () => ({
    type: FOOD_NUTRITION_MAP
})
export const yuhanBioMap = () => ({
    type: YUHAN_LIFE_BIO_MAP
})

// 클라이언트 사이드 메뉴 - 성준
export const initSideMenu = () =>({
    type: INIT_SIDE_MENU
})
export const consultation = () => ({
    type: SIDE_MENU_CONSULTATION
})
export const board = () => ({
    type: SIDE_MENU_BOARD
})
export const food = () => ({
    type: SIDE_MENU_FOOD
})
export const deptRec = () => ({
    type: SIDE_MENU_DEPT_REC
})

// 상담신청 - 성준
export const myCounsel = () => ({
    type: MY_COUNSEL
})
export const counselDate = () => ({
    type: COUNSEL_DATE
})
export const counselBtn = () => ({
    type: REQ_FOR_CONSULTATION
})
export const reqForConsultation = () => ({
    type: REQ_FOR_CONSULTATION_LIST
})
export const counselDateRegister = () => ({
    type: COUNSEL_DATE_REGISTER
})

// 모달 - 성준
export const initModal = () => ({
    type: INIT_MODAL
})
export const adminEnterModal = () => ({
    type: ADMIN_ENTER_MODAL
})

// 미니맵 상단 버튼 그룹 - 성준
export const aerialView = () => ({
    type: AERIAL_VIEW
})

// 버스정류장 진입여부
export const enterBusStationOne = () => ({
    type: ENTER_BUS_STATION_ONE,
});

export const leaveBusStationOne = () => ({
    type: LEAVE_BUS_STATION_ONE,
});

export const enterBusStationTwo = () => ({
    type: ENTER_BUS_STATION_TWO,
});

export const leaveBusStationTwo = () => ({
    type: LEAVE_BUS_STATION_TWO,
});