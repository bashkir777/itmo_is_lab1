package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.Chapter;
import com.bashkir777.api.data.repositories.ChapterRepository;
import com.bashkir777.api.dto.ChapterDTO;
import com.bashkir777.api.dto.PaginatedChapterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChaptersService {

    private final ChapterRepository chapterRepository;

    public PaginatedChapterDTO getAllChapters(int page, int size) {
        List<Chapter> chapters = chapterRepository.findAll(page, size);
        List<ChapterDTO> chapterDTOs = chapters.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        long totalElements = chapterRepository.countAll();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        return PaginatedChapterDTO.builder()
                .content(chapterDTOs)
                .totalPages(totalPages)
                .build();
    }

    private ChapterDTO convertToDTO(Chapter chapter) {
        return ChapterDTO.builder()
                .id(chapter.getId())
                .name(chapter.getName())
                .world(chapter.getWorld())
                .build();
    }
}