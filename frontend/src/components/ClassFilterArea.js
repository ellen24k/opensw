import { Autocomplete, TextField, Stack, Button } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { fetchBuildingList, fetchClassroomList, fetchFilteredClassroom, fetchCoursesFromClassroom } from "../api.js";
import { useNavigate } from 'react-router-dom';

const initalFloor = ["건물을 선택해주세요."]

function ClassFilterArea({ setCourses, classroomName = null }) {
    const [buildingList, setBuildingList] = useState(null);         // AutoComplete에 임베딩 될 건물목록
    const [floorList, setFloorList] = useState(null);               // AutoComplete에 임베딩 될 층수목록 (Depedent on selectBuilding)
    const [classroomList, setClassroomList] = useState(null);       // AutoComplete에 임베딩 될 강의실목록 (Dependent on selectBuilding, selectFloor)
    const [selectBuilding, setSelectBuilding] = useState(null);     // 사용자가 선택한 건물
    const [selectFloor, setSelectFloor] = useState(null);           // 사용자가 선택한 층수
    const [selectClassroom, setSelectClassroom] = useState(null);   // 사용자가 선택한 강의실실
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => { // 최초 Mount 또는 props.classroomName이 존재할 때 실행
            try {
                const classroomData = await fetchClassroomList();   // API로 강의실 목록 fetch
                const buildingData = await fetchBuildingList();     // API로 건물 목록 fetch

                if (classroomName !== null) {   // props.classroomName이 있으면 classroomName을 처리하는 handleExternalParam으로 Routing
                    handleExternalParam();
                }

                setClassroomList(classroomData);
                setBuildingList(buildingData);
                setFloorList(initalFloor);
            } catch (err) {
                console.error("데이터 불러오기 실패:", err);
            }
        };

        fetchData();
    }, [classroomName]);

    function handleBuildingSelect(event, building) { // AutoComplete에서 사용자가 Building을 선택했을 때 실행
        /* 선택된 Building으로 selectBuilding 변경 */
        setSelectBuilding(building);

        /* 상위 필터 조건이 변경되었으므로 Floor와 Classroom 모두 초기화한다. */
        setFloorList(null)
        setSelectFloor(null)
        setClassroomList(null)
        setSelectClassroom(null)

        const fetchData = async () => {
            try {
                /* Todo(Done): building to /query-classroom-list: all ClassRoom */
                /* Todo(Done): 우선, 먼저 Building으로 filtering된 강의실 먼저 classList에 갱신 */
                /* Todo(Done): 그 다음 building에 해당하는 floor 추출 후 FloorList Setting */
                const filteredClassRoom = await fetchFilteredClassroom(building);
                setClassroomList(filteredClassRoom)


                /* Todo(Done): 해당 building에 해당하는 강의실 fetch
                 -> building_prefix 제외하고 강의실 번호의 맨 앞 자리만 추출
                 -> 중복 데이터 filtering 후 floorList에 임베딩 */


                /* 일단 Building에 종속된 강의실명으로부터 floor만 추출. 이 상태에서는 중복이 존재함. */
                const preUniqueFloor = filteredClassRoom.map((classItem, index) => {
                    const prefixLength = building.length;
                    return classItem.slice(prefixLength).at(0)
                })

                /* 중복된 floor 제거 */
                const postUniqueFloor = [...new Set(preUniqueFloor)];

                /* 고유한 floor를 floorList에 상태 갱신 */
                setFloorList(postUniqueFloor);
            } catch (err) {
                console.error("데이터 불러오기 실패:", err);
            }
        };

        fetchData()
    }


    function handleFloorSelect(event, floor) { // AutoComplete에서 사용자가 floor을 선택했을 때 실행
        /* "건물을 선택해주세요"를 선택한 경우 무시 */
        if (floor == initalFloor[0]) {
            return
        }

        /* 사용자가 선택한 floor로 selectFloor 상태 변경 */
        setSelectFloor(floor);

        /* Floor는 Building 종속이므로 Classroom만 초기화하면 된다. */
        setClassroomList(null);
        setSelectClassroom(null);

        /* finalFilterString to /query-classroom-list */
        /* building_id + floor가 API가 원하는 형태의 Parameter이므로 적절히 합쳐줘야 함. */
        const finalFilterString = selectBuilding.concat("", floor)

        /* Todo(Done): floor가 선택되면 building_prefix + floor를 / query - classroom - list로 요청
                       -> 받아온 데이터를 classList에 임베딩 */
        const fetchData = async () => {
            try {
                const filteredClassRoom = await fetchFilteredClassroom(finalFilterString);
                setClassroomList(filteredClassRoom)
            } catch (err) {
                console.error("데이터 불러오기 실패:", err);
            }
        };

        fetchData()
    }

    function handleClassroomSelect(event, classroom) {
        /* AutoComplete가 갱신되도록 selectClassroom만 갱신해준다. */
        setSelectClassroom(classroom)
    }

    /* 사용자가 "초기화"버튼을 눌렀을 때 실행되는 이벤트 핸들러 */
    function handleClearButtonClick(event) {
        setSelectBuilding(null)
        setSelectClassroom(null)
        const fetchData = async () => {
            const data = await fetchClassroomList()
            setClassroomList(data)
        }
        fetchData()
        setSelectFloor(null)
        setFloorList(initalFloor)
    }

    /* 사용자가 "검색"버튼을 눌렀을 때 실행되는 이벤트 핸들러 */
    function handleSearchButtonClick() {
        if (selectClassroom == null) {
            return
        }

        /* 상위 컴포넌트를 재호출 해 현재 컴포넌트를 다시 설정한다. 
           이때 handleExternalParam()이 실행되고 selectClassroom(-> classroomName)으로 해당 강의실의 수업정보를 추출해
           courses를 설정한다. */
        navigate('/ViewClassSchedulePage/' + selectClassroom)
    }

    /* props.classroomName이 있을 때 실행 */
    async function handleExternalParam() {
        if (!classroomName) {
            console.log("classroomId is null")
            return
        }
        console.log(classroomName)
        /* SelectClassroom 상태를 classroomName으로 변경하여 AutoComplete에 반영 */
        setSelectClassroom(classroomName)

        /* 이번에는 반대로 classroomName 정보를 토대로 건물과 층수를 알아내 selectBuilding과 selectFloor 상태를 변경한다. */
        const buildingId = classroomName.match(/^[0-9]*[ㄱ-ㅎ가-힣]*/g)[0]
        const filteredByBuildingId = await fetchFilteredClassroom(buildingId);
        const preUniqueFloor = filteredByBuildingId.map((classItem, index) => {
            const prefixLength = buildingId.length;
            return classItem.slice(prefixLength).at(0)
        })
        const postUniqueFloor = [...new Set(preUniqueFloor)];
        setFloorList(postUniqueFloor);

        const classroomId = classroomName.slice(buildingId.length)
        const floor = classroomId.at(0)
        setSelectBuilding(buildingId)
        setSelectFloor(floor)


        /* 강의실목록 역시 classroomName의 건물과 층수에 맞게 재변경한다. */
        const finalFilterString = buildingId.concat("", floor)
        const filteredByBuildingIdAndFloor = await fetchFilteredClassroom(finalFilterString);
        setClassroomList(filteredByBuildingIdAndFloor)

        /* API 명세서에 따라 buildingId와 classroomId 파라미터를 전송하여 수업목록을 받아온다. */
        const courses = await fetchCoursesFromClassroom(buildingId, classroomId)

        /* props.setCourses로 상위 컴포넌트 상태인 courses를 초기화 하여 GanttChart에서 활용할 수 있도록 한다. */
        setCourses(courses)
    }

    return (
        <Stack spacing="10px">
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Autocomplete
                    options={buildingList}
                    sx={{ width: "47%" }}
                    renderInput={(params) => <TextField {...params} label="건물 선택" slotProps={{ ...params.slotProps, inputLabel: { style: {fontFamily: "NanumSquare"}} }} />}
                    value={selectBuilding}
                    onChange={(event, building) => { handleBuildingSelect(event, building) }} />
                <Autocomplete
                    options={floorList}
                    sx={{ width: "32%" }}
                    renderInput={(params) => <TextField {...params} label="층수" slotProps={{ ...params.slotProps, inputLabel: { style: { fontFamily: "NanumSquare" } } }} />}
                    value={selectFloor}
                    onChange={(event, floor) => { handleFloorSelect(event, floor) }} />
                <Button variant="outlined" sx={{ width: "17%", fontFamily: "NanumSquare" }} onClick={handleClearButtonClick}>초기화</Button>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Autocomplete
                    options={classroomList}
                    sx={{ width: "81%" }}
                    renderInput={(params) => <TextField {...params} label="강의실(필수)" slotProps={{ ...params.slotProps, inputLabel: { style: { fontFamily: "NanumSquare" } } }} />}
                    value={selectClassroom}
                    onChange={(event, classroom) => { handleClassroomSelect(event, classroom) }}
                />
                <Button variant="contained" sx={{ width: "17%", fontFamily: "NanumSquare" }} onClick={handleSearchButtonClick}>검색</Button>
            </Stack>
        </Stack >
    )
}

export default ClassFilterArea