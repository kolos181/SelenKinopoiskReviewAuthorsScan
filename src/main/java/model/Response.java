package model;

/**
 * Created by Kolos on 09.01.2016.
 */
public class Response {
    private String author;
    private String review;

    public Response(String author, String review) {
        this.author = author;
        this.review = review;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    @Override
    public String toString() {
        return "Response{" +
                "review='" + review + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}
