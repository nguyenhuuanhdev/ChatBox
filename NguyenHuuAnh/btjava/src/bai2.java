import java.util.Scanner;

public class bai2 {
    public static void main(String[] args) {
        //switch case
        //1. Nhập 1 tháng bất kỳ và đưa ra số ngày của tháng đó
        Scanner sc = new Scanner(System.in);
        System.out.println("Nhập tháng muốn xem(từ 1 -> 12):");
        int thang = sc.nextInt();
        switch (thang){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
            {
                System.out.println("Tháng "+thang+" có 31 ngày");
                break;
            }
            case 4:
            case 6:
            case 9:
            case 11:
            {
                System.out.println("Tháng "+thang+" có 30 ngày");
                break;
            }
            case 2:{
                System.out.println("Mời nhập năm:");
                int nam = sc.nextInt();
                if (nam % 4 == 0 && nam % 100 != 0 || nam % 400 == 0){
                    System.out.println("Tháng "+thang+" có 29 ngày");
                }else {
                    System.out.println("Tháng "+thang+" có 28 ngày");
                }
                break;
            }
        }
        //2. Nhập 1 ngày bất kỳ trong tuần và đưa ra thời khoá biểu của ngày đó
        System.out.println("Nhập vào thứ muốn xem(từ 2 -> 8):");
        int thu = sc.nextInt();
        System.out.println("Thứ "+thu+":");
        switch (thu){
            case 2:{
                System.out.println("Toán\nVăn\nAnh");
                break;
            }
            case 3:{
                System.out.println("Lý\nHoá\nSinh");
                break;
            }
            case 4:{
                System.out.println("Toán\nLý\nVăn");
                break;
            }
            case 5:{
                System.out.println("Anh\nSinh\nSử");
                break;
            }
            case 6:{
                System.out.println("Lý\nToán\nHoá");
                break;
            }
            case 7:{
                System.out.println("Toán\nLý\nHoá");
                break;
            }
            case 8:{
                System.out.println("Ngày nghỉ");
                break;
            }
            default:{
                System.out.println("Bạn nhập sai thứ trong tuần");
                break;
            }
        }
    }
}
