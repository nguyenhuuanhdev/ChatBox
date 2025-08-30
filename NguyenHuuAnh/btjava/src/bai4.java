import java.util.Scanner;

public class bai4 {
    public static void main(String[] args) {
        //Vòng lặp while
        //1. Nhập điểm từ 0 -> 10 sai nhập lại
        Scanner sc = new Scanner(System.in);
        System.out.println("Nhâp vào điểm:");
        double diem = sc.nextDouble();
        while (diem < 0 || diem > 10){
            System.out.println("Sai nhập lại điểm:");
            diem = sc.nextDouble();
        }

        //2. Nhập vào số có 2 chữ số và in số đó
        System.out.println("Nhập vào 1 số có 2 chữ số:");
        int n = sc.nextInt();
        while ((n < -99 || n > - 10) && (n < 10 || n > 99)){
            System.out.println("Nhập vào 1 số có 2 chữ số:");
            n = sc.nextInt();
        }
        System.out.println("Số có 2 chữ số được nhập là: "+n);

        //3. Tính tổng các số chẵn từ 1 đến 100
        int tong = 0;
        int i = 1;
        while (i <= 100){
            if (i % 2 == 0){
                tong += i;
            }
            i++;
        }
        System.out.println("Tổng các số chẵn từ 1 -> 100 = "+tong);
    }
}
