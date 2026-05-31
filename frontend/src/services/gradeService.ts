import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const getAnalyticsNilai = async (classId: string, subjectId: string, materialId: string) => {
  try {
    const q = query(
      collection(db, "quizResults"), 
      where("classId", "==", classId),
      where("subjectId", "==", subjectId),
      where("materialId", "==", materialId)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { average: 0, totalSiswa: 0, highest: 0, lowest: 0 };
    }

    let totalScore = 0;
    let scores: number[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const score = data.score || 0;
      totalScore += score;
      scores.push(score);
    });

    return {
      average: (totalScore / scores.length).toFixed(2),
      totalSiswa: scores.length,
      highest: Math.max(...scores),
      lowest: Math.min(...scores)
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};