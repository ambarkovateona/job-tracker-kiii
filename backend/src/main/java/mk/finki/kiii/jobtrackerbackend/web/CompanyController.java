package mk.finki.kiii.jobtrackerbackend.web;

import lombok.RequiredArgsConstructor;
import mk.finki.kiii.jobtrackerbackend.model.dto.CompanyDto;
import mk.finki.kiii.jobtrackerbackend.service.CompanyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public List<CompanyDto> listAll() {
        return companyService.listAll();
    }
}