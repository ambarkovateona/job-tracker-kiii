package mk.finki.kiii.jobtrackerbackend.service;

import lombok.RequiredArgsConstructor;
import mk.finki.kiii.jobtrackerbackend.model.Company;
import mk.finki.kiii.jobtrackerbackend.model.dto.CompanyDto;
import mk.finki.kiii.jobtrackerbackend.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public Company findOrCreate(String name, String industry) {
        return companyRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> companyRepository.save(
                        Company.builder().name(name).industry(industry).build()
                ));
    }

    public List<CompanyDto> listAll() {
        return companyRepository.findAll().stream()
                .map(c -> new CompanyDto(c.getId(), c.getName(), c.getIndustry()))
                .toList();
    }
}