import { Autocomplete, TextField, Stack, Button } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { fetchBuildingList, fetchClassroomList } from "../api.js";

const initalBuilding = [
    "1공",
    "2공",
    "3공",
    "국제",
    "글로컬산학협력관",
    "대학원동",
    "메종트리앙글르",
    "무용",
    "미디어",
    "미술",
    "사범",
    "사회",
    "상경",
    "서관",
    "소프트",
    "음악",
    "인문",
    "종합실험동",
    "체",
    "체육",
    "학군단"
]

const initalFloor = [
    "1",
    "2",
    "3"
]

const initalClass = [
    "소프트101",
    "소프트202"
]

function ClassFilterArea() {
    const [buildingList, setBuildingList] = useState(null);
    const [floorList, setFloorList] = useState(null);
    const [classList, setClassList] = useState(null);
    const [selectBuilding, setSelectBuilding] = useState(null);
    const [selectFloor, setSelectFloor] = useState(null);
    const [selectClass, setSelectClass] = useState(null);

    useEffect(() => {
        const classroomData = null;
        fetchClassroomList().then((result) => {
            classroomData = result
        });
        const buildingData = null;
        fetchBuildingList().then((result) => {
            buildingData = result
        });
        setClassList(classroomData);
        setBuildingList(buildingData);
        /* 초기 classList는 filtering 없이 전부 받아온다. */
        setFloorList(["건물을 선택해주세요."])
        console.log(classroomData)
        console.log(buildingData)
    }, [])

    function handleBuildingSelect(event, building) {
        setSelectBuilding(building);

        /* ToDo: building to /query-classroom-list: all ClassRoom */
        /* ToDo: 우선, 먼저 Building으로 filtering된 강의실 먼저 classList에 갱신 */

        const uniqueFloor = [...new Set(floorList)];

        setFloorList(initalFloor);
        /* Todo: 해당 building에 해당하는 강의실 fetch 
                 -> building_prefix 제외하고 강의실 번호의 맨 앞 자리만 추출
                 -> 중복 데이터 filtering 후 floorList에 임베딩
                 -> floor가 선택되면 building_prefix + floor를 /query-classroom-list로 요청
                 -> 받아온 데이터를 classList에 임베딩 */
    }

    function handleFloorSelect(event, floor) {
        setSelectFloor(floor);

        const finalFilterString = selectBuilding.concat(floor);
        /* finalFilterString to /query-classroom-list */

        setClassList(initalClass);
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
                    renderInput={(params) => <TextField {...params} label="층수" />} />
                <Button variant="outlined" sx={{ width: "15%" }}>초기화</Button>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Autocomplete
                    options={classList}
                    sx={{ width: "83%" }}
                    renderInput={(params) => <TextField {...params} label="층수" />} />
                <Button variant="contained" sx={{ width: "15%" }}>검색</Button>
            </Stack>
        </Stack >
    )
}

export default ClassFilterArea