import { Autocomplete, TextField, Stack, Button } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { fetchBuildingList, fetchClassroomList, fetchFilteredClassroom, fetchCoursesFromClassroom } from "../api.js";
import { useNavigate } from 'react-router-dom';

const initalFloor = ["건물을 선택해주세요."]

function ClassFilterArea({ setCourses, classroomName = null }) {
    const [buildingList, setBuildingList] = useState(null);
    const [floorList, setFloorList] = useState(null);
    const [classroomList, setClassroomList] = useState(null);
    const [selectBuilding, setSelectBuilding] = useState(null);
    const [selectFloor, setSelectFloor] = useState(null);
    const [selectClassroom, setSelectClassroom] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const classroomData = await fetchClassroomList();
                const buildingData = await fetchBuildingList();

                if (classroomName !== null) {
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

    function handleBuildingSelect(event, building) {
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

    function handleFloorSelect(event, floor) {
        if (floor == initalFloor[0]) {
            return
        }
        setSelectFloor(floor);

        /* Floor는 Building 종속이므로 Classroom만 초기화하면 된다. */
        setClassroomList(null);
        setSelectClassroom(null);

        /* finalFilterString to /query-classroom-list */
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

    function handleSearchButtonClick() {
        if (selectClassroom == null) {
            return
        }

        navigate('/ViewClassSchedulePage/' + selectClassroom)
    }

    async function handleExternalParam() {
        if (!classroomName) {
            console.log("classroomId is null")
            return
        }
        console.log(classroomName)
        setSelectClassroom(classroomName)



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


        const finalFilterString = buildingId.concat("", floor)
        const filteredByBuildingIdAndFloor = await fetchFilteredClassroom(finalFilterString);
        setClassroomList(filteredByBuildingIdAndFloor)


        const courses = await fetchCoursesFromClassroom(buildingId, classroomId)

        setCourses(courses)
    }

    return (
        <Stack spacing="10px" sx={{ paddingTop: "14px" }} useFlexGap>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Autocomplete
                    options={buildingList}
                    sx={{ width: "50%" }}
                    renderInput={(params) => <TextField {...params} label="건물 선택" />}
                    value={selectBuilding}
                    onChange={(event, building) => { handleBuildingSelect(event, building) }} />
                <Autocomplete
                    options={floorList}
                    sx={{ width: "31%" }}
                    renderInput={(params) => <TextField {...params} label="층수" />}
                    value={selectFloor}
                    onChange={(event, floor) => { handleFloorSelect(event, floor) }} />
                <Button variant="outlined" sx={{ width: "15%" }} onClick={handleClearButtonClick}>초기화</Button>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Autocomplete
                    options={classroomList}
                    sx={{ width: "83%" }}
                    renderInput={(params) => <TextField {...params} label="강의실(필수)" />}
                    value={selectClassroom}
                    onChange={(event, classroom) => { handleClassroomSelect(event, classroom) }}
                />
                <Button variant="contained" sx={{ width: "15%" }} onClick={handleSearchButtonClick}>검색</Button>
            </Stack>
        </Stack >
    )
}

export default ClassFilterArea