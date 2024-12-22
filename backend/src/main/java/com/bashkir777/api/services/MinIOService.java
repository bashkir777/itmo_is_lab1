package com.bashkir777.api.services;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.ResponseHeaderOverrides;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class MinIOService {

    @Value("${minIO.bucket}")
    private String bucketName;

    private final AmazonS3 minioClient;

    @Value("${minIO.link-live-time-millis}")
    private Long linkLiveTime;

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

    public String generateDownloadLink(String objectName) {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += linkLiveTime;
        expiration.setTime(expTimeMillis);

        ResponseHeaderOverrides responseHeaders = new ResponseHeaderOverrides();
        responseHeaders.setContentDisposition("attachment; filename=\"" + objectName + "\"");

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, objectName)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration)
                        .withResponseHeaders(responseHeaders);

        URL url = minioClient.generatePresignedUrl(generatePresignedUrlRequest);

        return url.toString();
    }

    public void removeFile(String filename){
        minioClient.deleteObject(bucketName, filename);
    }

}
