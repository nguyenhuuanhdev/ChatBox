import java.util.Scanner;

public class bai1 {
    public static void main(String[] args) {
        //if
        Scanner sc = new Scanner(System.in);
        System.out.println("Nhập số nguyên a:");
        int a = sc.nextInt();
        System.out.println("Nhập số nguyên b:");
        int b = sc.nextInt();
        if (a > b){
            System.out.println("Số lớn hơn là a");
        }else if (a < b){
            System.out.println("Số lớn hơn là b");
        }else {
            System.out.println("a và b bằng nhau");
        }

        System.out.println("Nhập số nguyên n:");
        int n = sc.nextInt();
        if (n % 2 == 0){
            System.out.println("n là số chẵn");
        }else {
            System.out.println("n là số lẻ");
        }
    }
}
