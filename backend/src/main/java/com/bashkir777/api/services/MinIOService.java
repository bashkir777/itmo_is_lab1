package com.bashkir777.api.services;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class MinIOService {

    @Value("${minIO.bucket}")
    private String bucketName;

    private final AmazonS3 minioClient;

    public String uploadFile(String username, MultipartFile file) throws IOException {
        String filename = System.currentTimeMillis() + username + ".json";

        if (!minioClient.doesBucketExistV2(bucketName)) {
            minioClient.createBucket(bucketName);
        }

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("application/json");
        metadata.setContentLength(file.getSize());
        minioClient.putObject(new PutObjectRequest(bucketName, filename, file.getInputStream(), metadata));
        return filename;
    }

    public void removeFile(String filename){
        minioClient.deleteObject(bucketName, filename);
    }

}
