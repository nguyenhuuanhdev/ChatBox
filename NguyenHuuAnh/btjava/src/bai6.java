import java.util.Scanner;

public class bai6 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Nhập điểm toán:");
        double diemToan = sc.nextDouble();
        System.out.println("Nhập điểm lý:");
        double diemLy = sc.nextDouble();
        System.out.println("Nhập điểm hoá:");
        double diemHoa = sc.nextDouble();
        System.out.println("Nhập điểm văn:");
        double diemVan = sc.nextDouble();
        System.out.println("Nhập điểm anh:");
        double diemAnh = sc.nextDouble();
        double dtb = (diemToan+diemLy+diemHoa+diemVan+diemAnh)/5;
        System.out.println("Điểm TB = "+dtb);
        if (dtb < 0){
            System.out.println("Nhập điểm sai");
        }else {
            if (dtb < 2.5){
                System.out.println("Học lực yếu");
            }else {
                if (dtb < 5){
                    System.out.println("Học lực kém");
                }else {
                    if (dtb < 6.5){
                        System.out.println("Học lực TB");
                    }else {
                        if (dtb < 8){
                            System.out.println("Học lực khá");
                        }else {
                            System.out.println("Học lực giỏi");
                        }
                    }
                }
            }
        }
    }
}
