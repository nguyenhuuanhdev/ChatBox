import java.util.Scanner;

public class bai5 {
    public static void main(String[] args) {
        //do while
        //1. Nhập điểm từ 0 -> 10 sai nhập lại
        Scanner sc = new Scanner(System.in);
        double diem;
        do {
            System.out.println("Nhập vào điểm:");
            diem = sc.nextDouble();
        }while (diem < 0 || diem > 10);

        //2. Nhập vào số có 2 chữ số và in ra số đó
        int n;
        do {
            System.out.println("Nhập vào số có 2 chữ số");
            n = sc.nextInt();
        }while ((n < -99 || n > - 10) && (n < 10 || n > 99));
        System.out.println("Số có 2 chữ số vừa nhập là: "+n);

        //3. Tính tổng các số chẵn từ 1 -> 100
        int tong = 0;
        int i = 1;
        do {
            if (i % 2 == 0){
                tong += i;
            }
            i++;
        }while (i <= 100);
        System.out.println("Tổng các số chẵn từ 1 -> 100 = "+tong);

        //4. Nhập 1 số nguyên dương từ bàn phím
        int a;
        do {
            System.out.println("Nhập 1 số nguyên dương:");
            a = sc.nextInt();
        }while (a <= 0);
        System.out.println("Số nguyên dương vừa nhập là: "+a);
    }
}
