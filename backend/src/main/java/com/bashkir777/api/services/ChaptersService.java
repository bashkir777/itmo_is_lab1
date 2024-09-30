package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.Chapter;
import com.bashkir777.api.data.repositories.ChapterRepository;
import com.bashkir777.api.dto.ChapterDTO;
import com.bashkir777.api.dto.PaginatedChapterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChaptersService {

    private final ChapterRepository chapterRepository;

    public PaginatedChapterDTO getAllChapters(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Chapter> chapterPage = chapterRepository.findAll(pageable);
        List<ChapterDTO> chapterDTOs = chapterPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return PaginatedChapterDTO.builder()
                .content(chapterDTOs)
                .totalPages(chapterPage.getTotalPages())
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