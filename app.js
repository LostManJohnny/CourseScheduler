var schedule = {
	Mon: [],
	Tue: [],
	Wed: [],
	Thu: [],
	Fri: [],
};

var valid_schedules = [];

const courses = {
	MobileAppDev: [
		{
			Section: "FTE01",
			Times: [
				createTimeSlot("W", "1400", "1600"),
				createTimeSlot("Th", "1300", "1400"),
				createTimeSlot("T", "1300", "1500"),
			],
		},
		{
			Section: "FTEO2",
			Times: [
				createTimeSlot("F", "1300", "1400"),
				createTimeSlot("Th", "1600", "1800"),
				createTimeSlot("M", "1500", "1700"),
			],
		},
	],
	IOT: [
		{
			Section: "FTO01",
			Times: [
				createTimeSlot("F", "1300", "1400"),
				createTimeSlot("M", "1500", "1700"),
				createTimeSlot("Th", "1600", "1800"),
			],
		},
	],
	BusIssues: [
		{
			Section: "FTE01",
			Times: [
				createTimeSlot("Th", "1500", "1600"),
				createTimeSlot("F", "0800", "0900"),
				createTimeSlot("W", "1700", "1800"),
				createTimeSlot("T", "1500", "1600"),
				createTimeSlot("M", "1700", "1800"),
			],
		},
		{
			Section: "FTE02",
			Times: [
				createTimeSlot("Th", "1200", "1300"),
				createTimeSlot("W", "1300", "1400"),
				createTimeSlot("F", "1400", "1500"),
				createTimeSlot("T", "0800", "0900"),
				createTimeSlot("M", "1100", "1200"),
			],
		},
		{
			Section: "FTO01",
			Times: [
				createTimeSlot("M", "0900", "1000"),
				createTimeSlot("Th", "1200", "1300"),
				createTimeSlot("T", "1400", "1500"),
				createTimeSlot("W", "1500", "1600"),
				createTimeSlot("F", "1500", "1600"),
			],
		},
	],
	BusMana: [
		{
			Section: "FTE01",
			Times: [
				createTimeSlot("Th", "1000", "1100"),
				createTimeSlot("F", "0900", "1000"),
				createTimeSlot("W", "1600", "1700"),
				createTimeSlot("T", "0800", "0900"),
				createTimeSlot("M", "1100", "1200"),
			],
		},
		{
			Section: "FTE02",
			Times: [
				createTimeSlot("Th", "1300", "1400"),
				createTimeSlot("F", "0800", "0900"),
				createTimeSlot("W", "1700", "1800"),
				createTimeSlot("M", "1000", "1100"),
				createTimeSlot("T", "1100", "1200"),
			],
		},
		{
			Section: "FTO01",
			Times: [
				createTimeSlot("M", "0800", "0900"),
				createTimeSlot("Th", "0900", "1000"),
				createTimeSlot("F", "1200", "1300"),
				createTimeSlot("T", "1200", "1300"),
				createTimeSlot("W", "1400", "1500"),
			],
		},
	],
	PDev: [
		{
			Section: "FTE01-1",
			Times: [
				createTimeSlot("F", "1200", "1300"),
				createTimeSlot("T", "1100", "1200"),
			],
		},
		{
			Section: "FTE01-2",
			Times: [
				createTimeSlot("T", "1200", "1300"),
				createTimeSlot("W", "1400", "1500"),
			],
		},
		{
			Section: "FTE02-1",
			Times: [
				createTimeSlot("F", "1500", "1600"),
				createTimeSlot("W", "1000", "1100"),
			],
		},
		{
			Section: "FTE02-2",
			Times: [
				createTimeSlot("M", "1100", "1200"),
				createTimeSlot("W", "1500", "1600"),
			],
		},
		{
			Section: "FTE03-1",
			Times: [
				createTimeSlot("Th", "0800", "0900"),
				createTimeSlot("W", "1100", "1200"),
			],
		},
		{
			Section: "FTE03-2",
			Times: [
				createTimeSlot("T", "1200", "1300"),
				createTimeSlot("W", "1400", "1500"),
			],
		},
	],
	WebDev: [
		{
			Section: "FE01",
			Times: [
				createTimeSlot("F", "1200", "1300"),
				createTimeSlot("Th", "0900", "1100"),
				createTimeSlot("T", "1500", "1700"),
			],
		},
		{
			Section: "FEO2",
			Times: [
				createTimeSlot("F", "1000", "1200"),
				createTimeSlot("Th", "1100", "1200"),
				createTimeSlot("M", "1300", "1500"),
			],
		},
	],
};

var indexes = {};

var iteration = 0;

for (var course in courses) {
	indexes[course] = {
		Max: courses[course].length,
		Current: 0,
	};
}

while (!maxed_out(indexes)) {
	var conflict = false;

	for (course in courses) {
		for (time in courses[course][indexes[course]["Current"]][
			"Times"
		]) {
			addToSchedule(
				courses[course][indexes[course]["Current"]]["Times"][
					time
				],
				schedule
			);
		}
	}

	for (day in schedule) {
		for (var i = 0; i < schedule[day].length - 1; i++) {
			for (var j = i + 1; j < schedule[day].length; j++) {
				if (i != j && !conflict) {
					conflict = checkConflict(
						schedule[day][i],
						schedule[day][j]
					);
				}
			}
		}
	}

	var section_list = [];
	var result = !conflict;

	if (!conflict) {
		for (course in indexes) {
			section_list[course] =
				courses[course][indexes[course]["Current"]][
					"Section"
				];
		}

		valid_schedules.push({
			Result: result,
			Sections: section_list,
		});
	}

	schedule = {
		Mon: [],
		Tue: [],
		Wed: [],
		Thu: [],
		Fri: [],
	};

	increment(indexes);
	iteration++;
}

console.log(valid_schedules);

function createTimeSlot(day, startTime, endTime) {
	return {
		Day: day,
		Start: startTime,
		End: endTime,
	};
}

function checkConflict(slotOne, slotTwo) {
	if (slotOne["Day"] == slotTwo["Day"]) {
		if (
			parseInt(slotOne["Start"]) ==
				parseInt(slotTwo["Start"]) ||
			parseInt(slotOne["End"]) == parseInt(slotTwo["End"]) ||
			(parseInt(slotOne["Start"]) >
				parseInt(slotTwo["Start"]) &&
				parseInt(slotOne["Start"]) <
					parseInt(slotTwo["End"])) ||
			(parseInt(slotOne["End"]) < parseInt(slotTwo["End"]) &&
				parseInt(slotOne["End"]) >
					parseInt(slotTwo["Start"])) ||
			(parseInt(slotTwo["Start"]) >
				parseInt(slotOne["Start"]) &&
				parseInt(slotTwo["Start"]) <
					parseInt(slotOne["End"])) ||
			(parseInt(slotTwo["End"]) < parseInt(slotOne["End"]) &&
				parseInt(slotTwo["End"]) > parseInt(slotOne["Start"]))
		) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function runTests() {
	var expected, actual;

	//Tests
	//Test 1
	console.log("Test 1 - Both Equal");
	test1 = createTimeSlot("M", "1400", "1700");
	test2 = createTimeSlot("M", "1400", "1700");

	expected = true;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 2
	console.log("Test 2 - Same start, end 1 > 2");
	test1 = createTimeSlot("M", "1400", "1800");
	test2 = createTimeSlot("M", "1400", "1700");

	expected = true;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 3
	console.log("Test 3 - Same start, end 1 < 2");
	test1 = createTimeSlot("M", "1400", "1700");
	test2 = createTimeSlot("M", "1400", "1800");

	expected = true;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 4
	console.log("Test 4 - Start 1 > 2, same end");
	test1 = createTimeSlot("M", "1500", "1800");
	test2 = createTimeSlot("M", "1400", "1800");

	expected = true;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 5
	console.log("Test 5 - Start 1 < 2, same end");
	test1 = createTimeSlot("M", "1400", "1800");
	test2 = createTimeSlot("M", "1500", "1800");

	expected = true;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 6
	console.log("Test 6 - Start 1 < 2, End 1 < 2");
	test1 = createTimeSlot("M", "1400", "1700");
	test2 = createTimeSlot("M", "1500", "1800");

	expected = true;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 7
	console.log("Test 7 - Start 1 > 2, End 1 < 2");
	test1 = createTimeSlot("M", "1500", "1700");
	test2 = createTimeSlot("M", "1400", "1800");

	expected = true;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 8
	console.log("Test 8 - Start 1 < 2, End 1 > 2");
	test1 = createTimeSlot("M", "1400", "1800");
	test2 = createTimeSlot("M", "1500", "1700");

	expected = true;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 9
	console.log("Test 9 - Start 1 < 2, End 1 < 2");
	test1 = createTimeSlot("M", "1400", "1700");
	test2 = createTimeSlot("M", "1500", "1800");

	expected = true;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 10
	console.log("Test 10 - 1 > 2");
	test1 = createTimeSlot("M", "1400", "1500");
	test2 = createTimeSlot("M", "1500", "1800");

	expected = false;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);

	//Test 11
	console.log("Test 11 - 1 < 2");
	test1 = createTimeSlot("M", "1500", "1800");
	test2 = createTimeSlot("M", "1400", "1500");

	expected = false;
	actual = checkConflict(test1, test2);
	console.log("Expected: " + expected);
	console.log("Actual: " + actual);
}

function maxed_out(indexes) {
	for (course in indexes) {
		if (
			indexes[course]["Max"] - 1 !=
			indexes[course]["Current"]
		) {
			return false;
		}
	}

	return true;
}

function increment(indexes) {
	for (course in indexes) {
		if (
			indexes[course]["Current"] ==
			indexes[course]["Max"] - 1
		) {
			indexes[course]["Current"] = 0;
		} else {
			indexes[course]["Current"] =
				indexes[course]["Current"] + 1;
			break;
		}
	}
}

function addToSchedule(timeslot, schedule) {
	switch (timeslot["Day"]) {
		case "M":
			schedule["Mon"].push(timeslot);
			break;

		case "T":
			schedule["Tue"].push(timeslot);
			break;

		case "W":
			schedule["Wed"].push(timeslot);
			break;

		case "Th":
			schedule["Thu"].push(timeslot);
			break;

		case "F":
			schedule["Fri"].push(timeslot);
			break;
	}
}
