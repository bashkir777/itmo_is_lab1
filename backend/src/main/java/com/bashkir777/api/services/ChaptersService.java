package com.bashkir777.api.services;

import com.bashkir777.api.data.repositories.ChapterRepository;
import com.bashkir777.api.dto.ChapterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChaptersService {

    private final ChapterRepository chapterRepository;

    public List<ChapterDTO> getAllChapters() {
        return chapterRepository.findAll().stream()
                .map(chapter -> ChapterDTO.builder()
                        .id(chapter.getId())
                        .name(chapter.getName())
                        .world(chapter.getWorld())
                        .build())
                .collect(Collectors.toList());
    }
}