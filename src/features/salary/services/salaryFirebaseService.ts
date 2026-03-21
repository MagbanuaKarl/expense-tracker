import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SalaryData } from "@/types";

const SALARY_COLLECTION = "salaries";

// Demo salary data store
let demoSalaryData: SalaryData | null = null;

export class SalaryService {
  static async getSalaryData(userId: string): Promise<SalaryData | null> {
    try {
      if (userId === "demo") {
        return demoSalaryData;
      }

      const docRef = doc(db, SALARY_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as SalaryData;
      }

      return null;
    } catch (error) {
      console.error("Error getting salary data:", error);
      throw error;
    }
  }

  static async saveSalaryData(userId: string, salaryData: Omit<SalaryData, "createdAt" | "updatedAt">): Promise<void> {
    try {
      if (userId === "demo") {
        const now = new Date();
        demoSalaryData = {
          ...salaryData,
          createdAt: now,
          updatedAt: now,
        };
        return;
      }

      const docRef = doc(db, SALARY_COLLECTION, userId);
      const now = new Date();

      const data = {
        ...salaryData,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(docRef, data);
    } catch (error) {
      console.error("Error saving salary data:", error);
      throw error;
    }
  }

  static async updateSalaryData(userId: string, updates: Partial<Omit<SalaryData, "createdAt" | "updatedAt">>): Promise<void> {
    try {
      if (userId === "demo") {
        if (demoSalaryData) {
          demoSalaryData = {
            ...demoSalaryData,
            ...updates,
            updatedAt: new Date(),
          };
        }
        return;
      }

      const docRef = doc(db, SALARY_COLLECTION, userId);
      const data = {
        ...updates,
        updatedAt: new Date(),
      };

      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating salary data:", error);
      throw error;
    }
  }
}