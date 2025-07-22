
import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";

// Utility function to generate mock attendance data
const generateMockAttendanceData = (month, year) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    return {
      day,
      date: date.toLocaleString("en-US", { weekday: "long" }),
      checkIn: day % 2 === 0 ? "09:00 AM" : null,
      checkOut: day % 2 === 0 ? "05:00 PM" : null,
    };
  });
};

// Mock upcoming holidays for 2025
const upcomingHolidays = [
  { date: new Date(2025, 6, 15), name: "Independence Day" },
  { date: new Date(2025, 7, 15), name: "Raksha Bandhan" },
  { date: new Date(2025, 9, 2), name: "Gandhi Jayanti" },
];

const AttendancePage = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    try {
      const saved = localStorage.getItem("isCheckedIn");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error("Error parsing isCheckedIn from localStorage:", error);
      return false;
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filter, setFilter] = useState("all");
  const [attendanceData, setAttendanceData] = useState(() => {
    try {
      const saved = localStorage.getItem("attendanceData");
      return saved
        ? JSON.parse(saved)
        : generateMockAttendanceData(
            new Date().getMonth(),
            new Date().getFullYear()
          );
    } catch (error) {
      console.error("Error parsing attendanceData from localStorage:", error);
      return generateMockAttendanceData(
        new Date().getMonth(),
        new Date().getFullYear()
      );
    }
  });
  const [showAllHolidays, setShowAllHolidays] = useState(false);
  const [checkInOutMessage, setCheckInOutMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem("isCheckedIn", JSON.stringify(isCheckedIn));
    } catch (error) {
      console.error("Error saving isCheckedIn to localStorage:", error);
    }
  }, [isCheckedIn]);

  useEffect(() => {
    try {
      localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
    } catch (error) {
      console.error("Error saving attendanceData to localStorage:", error);
    }
  }, [attendanceData]);

  useEffect(() => {
    const newData = generateMockAttendanceData(selectedMonth, selectedYear);
    setAttendanceData((prev) => {
      const mergedData = newData.map((newRecord) => {
        const existingRecord = prev.find(
          (record) => record.day === newRecord.day
        );
        return existingRecord
          ? {
              ...newRecord,
              checkIn: existingRecord.checkIn,
              checkOut: existingRecord.checkOut,
            }
          : newRecord;
      });
      return mergedData;
    });
  }, [selectedMonth, selectedYear]);

  const today = new Date("2025-07-02T10:46:00+05:30"); // 10:46 AM IST, July 2, 2025
  const currentDay = today.toLocaleString("en-US", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  });
  const currentDateStr = today.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const currentTimeStr = today.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  const handleToggle = () => {
    if (isCheckedIn) {
      setShowModal(true);
    } else {
      setIsCheckedIn(true);
      setCheckInOutMessage('Checked in successfully!');
      setTimeout(() => setCheckInOutMessage(''), 2000);
      updateAttendanceData(today.getDate(), currentTimeStr, null);
    }
  };

  const confirmCheckout = () => {
    setIsCheckedIn(false);
    setShowModal(false);
    setCheckInOutMessage('Checked out successfully!');
    setTimeout(() => setCheckInOutMessage(''), 2000);
    updateAttendanceData(today.getDate(), null, currentTimeStr);
  };

  const cancelCheckout = () => {
    setShowModal(false);
  };

  const updateAttendanceData = (day, checkIn, checkOut) => {
    setAttendanceData((prev) =>
      prev.map((record) =>
        record.day === day
          ? {
              ...record,
              checkIn: checkIn || record.checkIn,
              checkOut: checkOut || record.checkOut,
            }
          : record
      )
    );
  };

  const filteredData = attendanceData.filter((record) => {
    if (filter === "present") return record.checkIn && record.checkOut;
    if (filter === "absent") return !record.checkIn || !record.checkOut;
    return true;
  });

  const totalPresent = attendanceData.filter(
    (record) => record.checkIn && record.checkOut
  ).length;
  const totalAbsent = attendanceData.filter(
    (record) => !record.checkIn || !record.checkOut
  ).length;

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(
        `Attendance Report - ${selectedMonth + 1}/${selectedYear}`,
        10,
        10
      );
      doc.setFontSize(12);
      let y = 30;

      doc.text("Day | Date | Check In | Check Out", 10, 20);

      filteredData.forEach((record) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(
          `${record.day} | ${record.date} | ${record.checkIn || "-"} | ${
            record.checkOut || "-"
          }`,
          10,
          y
        );
        y += 10;
      });
      doc.save(`attendance_${selectedMonth + 1}_${selectedYear}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const downloadExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(
        filteredData.map((record) => ({
          Day: record.day,
          Date: record.date,
          "Check In": record.checkIn || "-",
          "Check Out": record.checkOut || "-",
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");
      XLSX.writeFile(
        wb,
        `attendance_${selectedMonth + 1}_${selectedYear}.xlsx`
      );
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Error generating Excel file. Please try again.");
    }
  };

  const printTable = () => {
    try {
      window.print();
    } catch (error) {
      console.error("Error printing:", error);
      alert("Error printing. Please try again.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />
        <main className="p-4 sm:p-6 flex-1 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {/* Check-in/Check-out Card */}
            <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-4 sm:p-6 border border-blue-100 bg-gradient-to-br from-blue-100 to-blue-200">
              <span className="text-black text-sm sm:text-base font-semibold mb-2 text-center">
                Attendance
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-blue-800">
                {isCheckedIn ? "Checked In" : "Checked Out"}
              </span>
              <span className="text-sm sm:text-base text-blue-600 mt-2">{currentDay}</span>
              <span className="text-sm sm:text-base text-blue-600">{currentDateStr}</span>
              <span className="text-sm sm:text-base text-blue-600">{currentTimeStr}</span>
              <button
                onClick={handleToggle}
                className={`mt-3 px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isCheckedIn
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isCheckedIn ? "Check Out" : "Check In"}
              </button>
              {checkInOutMessage && (
                <p className="text-green-600 text-sm text-center mt-2 animate-fade-in">
                  {checkInOutMessage}
                </p>
              )}
            </div>
            {/* Total Present Card */}
            <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-4 sm:p-6 border border-blue-100 bg-gradient-to-br from-green-100 to-green-200">
              <span className="text-black text-sm sm:text-base font-semibold mb-2 text-center">
                Total Present
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-green-800">
                {totalPresent}
              </span>
              <span className="text-sm sm:text-base text-blue-600">This Month</span>
            </div>
            {/* Total Absent Card */}
            <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-4 sm:p-6 border border-blue-100 bg-gradient-to-br from-red-100 to-red-200">
              <span className="text-black text-sm sm:text-base font-semibold mb-2 text-center">
                Total Absent
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-red-800">
                {totalAbsent}
              </span>
              <span className="text-sm sm:text-base text-blue-600">This Month</span>
            </div>
            {/* Upcoming Holidays Card */}
            <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-4 sm:p-6 border border-blue-100 bg-gradient-to-br from-purple-100 to-purple-200">
              <span className="text-black text-sm sm:text-base font-semibold mb-2 text-center">
                Upcoming Holidays
              </span>
              {upcomingHolidays
                .filter((holiday) => holiday.date > today)
                .slice(0, showAllHolidays ? undefined : 1)
                .map((holiday, index) => (
                  <span
                    key={index}
                    className="text-sm sm:text-base text-blue-700 text-center block"
                  >
                    {holiday.name} -{" "}
                    {holiday.date.toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                      timeZone: "Asia/Kolkata",
                    })}
                  </span>
                ))}
              {upcomingHolidays.filter((holiday) => holiday.date > today)
                .length > 1 && (
                <button
                  onClick={() => setShowAllHolidays(!showAllHolidays)}
                  className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                >
                  {showAllHolidays ? "Show Less" : "Show All"}
                </button>
              )}
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 mb-6">
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2 w-full sm:w-auto">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(0, i).toLocaleString("en-US", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - 5 + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                      filter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("present")}
                    className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                      filter === "present"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => setFilter("absent")}
                    className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                      filter === "absent"
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    Absent
                  </button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={downloadPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors"
                  >
                    PDF
                  </button>
                  <button
                    onClick={downloadExcel}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors"
                  >
                    Excel
                  </button>
                  <button
                    onClick={printTable}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>

            {/* Table - Desktop View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm text-blue-900">
                  <thead className="bg-blue-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">
                        Check In
                      </th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">
                        Check Out
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-100">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-blue-400">
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((record) => (
                        <tr key={record.day} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">{record.day}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block w-3 h-3 rounded-full ${
                                record.checkIn && record.checkOut
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              aria-label={
                                record.checkIn && record.checkOut
                                  ? "Present"
                                  : "Absent"
                              }
                            ></span>
                          </td>
                          <td className="px-4 py-3">{record.date}</td>
                          <td className="px-4 py-3">{record.checkIn || "-"}</td>
                          <td className="px-4 py-3">{record.checkOut || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card View - Mobile */}
            <div className="md:hidden p-4 space-y-3">
              {filteredData.length === 0 ? (
                <div className="text-center py-8 text-blue-400">
                  No records found.
                </div>
              ) : (
                filteredData.map((record) => (
                  <div key={record.day} className="bg-blue-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-900">
                        Day {record.day}
                      </span>
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          record.checkIn && record.checkOut
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        aria-label={
                          record.checkIn && record.checkOut
                            ? "Present"
                            : "Absent"
                        }
                      ></span>
                    </div>
                    <div className="text-xs text-blue-700">{record.date}</div>
                    <div className="flex justify-between text-xs text-blue-500">
                      <span>Check In: {record.checkIn || "-"}</span>
                      <span>Check Out: {record.checkOut || "-"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Modal for Checkout Confirmation */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4">
              <div className="relative w-full max-w-xs sm:max-w-sm bg-white bg-opacity-90 rounded-lg shadow-xl border border-blue-100 max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-800 text-center">
                    Are you sure you want to check out?
                  </h3>
                  <div className="flex justify-end space-x-2 sm:space-x-4">
                    <button
                      onClick={cancelCheckout}
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmCheckout}
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs sm:text-sm"
                    >
                      Check Out Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;