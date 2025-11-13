"use client";
import NavigationTabs from "./NavigationTabs";
import StatsCards from "./statCards";
import ODHoursModal from "./ODHoursModal";
import GradesModal from "./Exams/GradesModal";
import AttendanceTabs from "./attendance/attendanceTabs";
import ExamsSubTabs from "./Exams/ExamSubsTab";
import MarksDisplay from "./Exams/marksDislay";
import ScheduleDisplay from "./Exams/SchduleDisplay";
import HostelSubTabs from "./Hostel/HostelSubsTab";
import MessDisplay from "./Hostel/messDisplay";
import LaundryDisplay from "./Hostel/LaundryDisplay";
import AttendanceSubTabs from "./attendance/AttendanceSubsTabs";
import CalendarView from "./attendance/CalendarView";
import { useState, useEffect } from "react";
import { useRef } from "react";
import LeaveDisplay from "./Hostel/LeaveDisplay";
import AllGradesDisplay from "./Exams/AllGradesDisplay";
import { User, GraduationCap, Building2, Mail, Phone, MapPin } from "lucide-react";

export default function DashboardContent({
  activeTab,
  setActiveTab,
  handleLogOutRequest,
  handleReloadRequest,
  GradesData,
  allGradesData,
  attendancePercentage,
  ODhoursData,
  ODhoursIsOpen,
  setODhoursIsOpen,
  GradesDisplayIsOpen,
  setGradesDisplayIsOpen,
  attendanceData,
  activeDay,
  setActiveDay,
  marksData,
  activeSubTab,
  setActiveSubTab,
  ScheduleData,
  hostelData,
  HostelActiveSubTab,
  setHostelActiveSubTab,
  activeAttendanceSubTab,
  setActiveAttendanceSubTab,
  calendarData,
  CGPAHidden,
  setCGPAHidden,
  calendarType,
  setCalender,
  setCalenderType,
  setIsReloading,
  setProgressBar,
  setMessage,
  loginToVTOP,
  setAllGradesData,
  sethostelData,
  setGradesData,
  setScheduleData,
  currSemesterID
}) {
  const [studentInfo, setStudentInfo] = useState({
    name: "Student",
    regNo: "",
    branch: "",
    email: "",
    phone: "",
    photo: null
  });

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const hasMoved = useRef(false);

  const tabsOrder = ["attendance", "exams", "hostel"];

  // Extract student info from localStorage or attendance data
  useEffect(() => {
    const storedName = localStorage.getItem("studentName");
    const storedRegNo = localStorage.getItem("studentRegNo");
    const storedBranch = localStorage.getItem("studentBranch");
    const storedUsername = localStorage.getItem("username");
    
    if (storedName) setStudentInfo(prev => ({ ...prev, name: storedName }));
    if (storedRegNo || storedUsername) setStudentInfo(prev => ({ ...prev, regNo: storedRegNo || storedUsername || "" }));
    if (storedBranch) setStudentInfo(prev => ({ ...prev, branch: storedBranch }));
    
    // Try to extract from attendance data if available
    if (attendanceData?.attendance && attendanceData.attendance.length > 0) {
      const firstCourse = attendanceData.attendance[0];
      // You can extract more info here if available in the data
    }
  }, [attendanceData]);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    hasMoved.current = false;
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    touchEndX.current = touch.clientX;
    touchEndY.current = touch.clientY;

    const diffX = Math.abs(touchStartX.current - touchEndX.current);
    const diffY = Math.abs(touchStartY.current - touchEndY.current);

    if (diffX > diffY && diffX > 10) hasMoved.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!hasMoved.current) return;

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;

    if (Math.abs(diffY) > Math.abs(diffX)) return;

    const target = e.target.closest("button, a, input, textarea, select, [data-prevent-swipe]");
    if (target) return;

    const scrollable = e.target.closest("[data-scrollable], [style*='overflow-x']");
    if (scrollable) return;

    if (Math.abs(diffX) < 75) return;

    const currentIndex = tabsOrder.indexOf(activeTab);
    if (diffX > 0 && currentIndex < tabsOrder.length - 1) {
      setActiveTab(tabsOrder[currentIndex + 1]);
    } else if (diffX < 0 && currentIndex > 0) {
      setActiveTab(tabsOrder[currentIndex - 1]);
    }
  };

  const handleAllGradesFetch = async () => {
    setIsReloading(true);
    try {
      const { cookies, dashboardHtml } = await loginToVTOP();

      const AllGradesRes = await fetch("/api/fetchAllGrades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookies: cookies, dashboardHtml: dashboardHtml }),
      });

      const AllGradesData = await AllGradesRes.json();
      setProgressBar((prev) => prev + 40);

      setAllGradesData(AllGradesData);
      localStorage.setItem("allGradesData", JSON.stringify(AllGradesData));

      setMessage((prev) => prev + "\n✅ All grades reloaded successfully!");
      setProgressBar(100);
      setIsReloading(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Calendar fetch failed, check console.");
      setProgressBar(0);
    }
  };

  const handleCalendarFetch = async (FncalendarType) => {
    setIsReloading(true);
    try {
      const { cookies, dashboardHtml } = await loginToVTOP();

      const calenderRes = await fetch("/api/parseSemTT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cookies: cookies,
          dashboardHtml: dashboardHtml,
          type: FncalendarType || "ALL",
          semesterId: currSemesterID
        }),
      });

      const CalenderRes = await calenderRes.json();
      setProgressBar((prev) => prev + 40);

      setCalender(CalenderRes);
      setCalenderType(FncalendarType);
      localStorage.setItem("calender", JSON.stringify(CalenderRes));
      localStorage.setItem("calendarType", FncalendarType);

      setMessage((prev) => prev + "\n✅ Calendar reloaded successfully!");
      setProgressBar(100);
      setIsReloading(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Calendar fetch failed, check console.");
      setProgressBar(0);
    }
  };

  const handleFetchGrades = async () => {
    setIsReloading(true);
    try {
      const { cookies, dashboardHtml } = await loginToVTOP();

      const gradesRes = await fetch("/api/fetchGrades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookies, dashboardHtml, semesterId: currSemesterID }),
      });

      const gradesData = await gradesRes.json();
      setProgressBar((prev) => prev + 40);

      setGradesData(gradesData);
      localStorage.setItem("grades", JSON.stringify(gradesData));

      setMessage((prev) => prev + "\n✅ Grades reloaded successfully!");
      setProgressBar(100);
      setIsReloading(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Grades fetch failed, check console.");
      setProgressBar(0);
    }
  };

  const handleHostelDetailsFetch = async () => {
    setIsReloading(true);
    try {
      const { cookies, dashboardHtml } = await loginToVTOP();

      const HostelRes = await fetch("/api/fetchHostelDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookies: cookies, dashboardHtml: dashboardHtml }),
      });
      const HostelData = await HostelRes.json();
      setProgressBar((prev) => prev + 40);
      sethostelData(HostelData);
      localStorage.setItem("hostelData", JSON.stringify(HostelData));
      setMessage((prev) => prev + "\n✅ Hostel details reloaded successfully!");
      setProgressBar(100);
      setIsReloading(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Hostel details fetch failed, check console.");
      setProgressBar(0);
    }
  };

  const handleScheduleFetch = async () => {
    setIsReloading(true);
    try {
      const { cookies, dashboardHtml } = await loginToVTOP();

      const ScheduleRes = await fetch("/api/fetchExamSchedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookies: cookies, dashboardHtml: dashboardHtml, semesterId: currSemesterID }),
      });
      const ScheduleData = await ScheduleRes.json();
      setProgressBar((prev) => prev + 40);
      setScheduleData(ScheduleData);
      localStorage.setItem("schedule", JSON.stringify(ScheduleData));
      setMessage((prev) => prev + "\n✅ Schedule reloaded successfully!");
      setProgressBar(100);
      setIsReloading(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Schedule fetch failed, check console.");
      setProgressBar(0);
    }
  };

  return (
    <div
      className="w-full max-w-md md:max-w-full mx-auto overflow-hidden"
      style={{ backgroundColor: '#0a0f1e' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Modern Header with Student Info */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #141D38 0%, #1a2847 100%)',
          borderBottom: '2px solid rgba(252, 219, 50, 0.2)'
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: '#FCDB32' }}></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: '#FCDB32' }}></div>
        
        <div className="relative z-10 px-6 pt-6 pb-4">
          {/* Top Bar with Logo and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(252, 219, 50, 0.1)' }}>
                <GraduationCap className="w-6 h-6" style={{ color: '#FCDB32' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#FCDB32' }}>VTOP</h1>
                <p className="text-xs text-gray-400">Student Portal</p>
              </div>
            </div>
          </div>

          {/* Student Profile Card */}
          <div 
            className="rounded-2xl p-5 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(252, 219, 50, 0.15)'
            }}
          >
            <div className="flex items-center gap-4">
              {/* Profile Picture */}
              <div 
                className="relative shrink-0"
                style={{
                  width: '80px',
                  height: '80px'
                }}
              >
                <div 
                  className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #FCDB32 0%, #f0c420 100%)',
                    border: '3px solid rgba(252, 219, 50, 0.3)'
                  }}
                >
                  {studentInfo.photo ? (
                    <img src={studentInfo.photo} alt="Student" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10" style={{ color: '#141D38' }} />
                  )}
                </div>
                <div 
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#10b981', border: '2px solid #141D38' }}
                >
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-white truncate mb-1">
                  {studentInfo.name || "Student Name"}
                </h2>
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: '#FCDB32' }}>
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">{studentInfo.regNo || "Registration No"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">
                    {(hostelData && hostelData.hostelInfo && hostelData.hostelInfo.blockName) || "VIT Chennai"}
                  </span>
                  {hostelData && hostelData.hostelInfo && hostelData.hostelInfo.roomNo && (
                    <span>• Room {hostelData.hostelInfo.roomNo}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(252, 219, 50, 0.1)' }}>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: '#FCDB32' }}>
                  {attendancePercentage?.percentage ? `${attendancePercentage.percentage}%` : '0%'}
                </div>
                <div className="text-xs text-gray-400 mt-1">Attendance</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: '#FCDB32' }}>
                  {(allGradesData && typeof allGradesData.cgpa === 'string' ? allGradesData.cgpa : 
                    allGradesData && typeof allGradesData.cgpa === 'number' ? allGradesData.cgpa.toFixed(2) :
                    GradesData && GradesData.cgpa && typeof GradesData.cgpa === 'object' && GradesData.cgpa.cgpa ? GradesData.cgpa.cgpa :
                    GradesData && typeof GradesData.cgpa === 'string' ? GradesData.cgpa :
                    GradesData && typeof GradesData.cgpa === 'number' ? GradesData.cgpa.toFixed(2) : 'N/A')}
                </div>
                <div className="text-xs text-gray-400 mt-1">CGPA</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: '#FCDB32' }}>
                  {(attendanceData && attendanceData.attendance && attendanceData.attendance.length) || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">Courses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogOutRequest={handleLogOutRequest}
        handleReloadRequest={handleReloadRequest}
        hostelData={hostelData}
      />

      <div 
        className="min-h-screen text-gray-100 transition-colors"
        style={{ backgroundColor: '#0a0f1e' }}
      >
        <StatsCards
          attendancePercentage={attendancePercentage}
          ODhoursData={ODhoursData}
          setODhoursIsOpen={setODhoursIsOpen}
          feedbackStatus={GradesData.feedback}
          marksData={marksData}
          setGradesDisplayIsOpen={setGradesDisplayIsOpen}
          CGPAHidden={CGPAHidden}
          setCGPAHidden={setCGPAHidden}
        />

        {ODhoursIsOpen && (
          <ODHoursModal
            ODhoursData={ODhoursData}
            onClose={() => setODhoursIsOpen(false)}
          />
        )}

        {GradesDisplayIsOpen && (
          <GradesModal
            GradesData={GradesData}
            marksData={marksData}
            onClose={() => setGradesDisplayIsOpen(false)}
            handleFetchGrades={handleFetchGrades}
            attendance={attendanceData.attendance}
          />
        )}

        {activeTab === "attendance" && attendanceData?.attendance && (
          <div className="animate-fadeIn">
            <AttendanceSubTabs
              activeSubTab={activeAttendanceSubTab}
              setActiveAttendanceSubTab={setActiveAttendanceSubTab}
            />

            {activeAttendanceSubTab === "attendance" && (
              <>
                {!calendarType && (
                  <CalendarTabWrapper
                    calendarType={calendarType}
                    handleCalendarFetch={handleCalendarFetch}
                  />
                )}
                <AttendanceTabs
                  data={attendanceData}
                  activeDay={activeDay}
                  setActiveDay={setActiveDay}
                  calendars={calendarData?.calendars || []}
                />
              </>
            )}

            {activeAttendanceSubTab === "calendar" && (
              <>
                <CalendarView
                  calendars={calendarData?.calendars || []}
                  calendarType={calendarType}
                  handleCalendarFetch={handleCalendarFetch}
                />
                <CalendarTabWrapper
                  calendarType={calendarType}
                  handleCalendarFetch={handleCalendarFetch}
                />
              </>
            )}
          </div>
        )}

        {activeTab === "exams" && marksData && (
          <div className="animate-fadeIn">
            <ExamsSubTabs
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
            {activeSubTab === "marks" && <MarksDisplay data={marksData} />}
            {activeSubTab === "schedule" && <ScheduleDisplay data={ScheduleData} handleScheduleFetch={handleScheduleFetch} />}
            {activeSubTab === "grades" && <AllGradesDisplay data={allGradesData} handleAllGradesFetch={handleAllGradesFetch} />}
          </div>
        )}

        {activeTab === "hostel" && (
          <div className="animate-fadeIn">
            <HostelSubTabs
              HostelActiveSubTab={HostelActiveSubTab}
              setHostelActiveSubTab={setHostelActiveSubTab}
              hostelData={hostelData}
            />
            {HostelActiveSubTab === "mess" && <MessDisplay hostelData={hostelData} handleHostelDetailsFetch={handleHostelDetailsFetch} />}
            {HostelActiveSubTab === "laundry" && <LaundryDisplay hostelData={hostelData} handleHostelDetailsFetch={handleHostelDetailsFetch} />}
            {HostelActiveSubTab === "leave" && <LeaveDisplay leaveData={hostelData.leaveHistory} handleHostelDetailsFetch={handleHostelDetailsFetch} />}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarTabWrapper({ calendarType, handleCalendarFetch }) {
  const CALENDAR_TYPES = {
    ALL: "General Semester",
    ALL02: "General Flexible",
    ALL03: "General Freshers",
    ALL05: "General LAW",
    ALL06: "Flexible Freshers",
    ALL08: "Cohort LAW",
    ALL11: "Flexible Research",
    WEI: "Weekend Intra Semester",
  };

  const [selectedType, setSelectedType] = useState(calendarType || "ALL");

  function handleSubmitCalendarType() {
    handleCalendarFetch(selectedType);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 midnight:text-gray-100">
        Select Calendar Type
      </h2>

      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 
                   dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
                   midnight:bg-[#0f172a] midnight:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {Object.entries(CALENDAR_TYPES).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmitCalendarType}
        className="px-6 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 
                   dark:bg-blue-500 dark:hover:bg-blue-600
                   data-[theme=midnight]:bg-blue-500 data-[theme=midnight]:hover:bg-blue-600
                   transition-colors duration-150"
      >
        Submit
      </button>
    </div>
  );
}
