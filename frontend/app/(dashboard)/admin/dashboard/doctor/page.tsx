import DoctorsPage from "../../components/Doctors";
import { doctors } from "../../components/doctor";



export default function DashboardDoctorPage(){
    return(
           <>
           <DoctorsPage doctors={doctors}/>
           </>
    );
}