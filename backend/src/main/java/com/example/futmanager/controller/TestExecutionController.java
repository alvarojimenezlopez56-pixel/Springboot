package com.example.futmanager.controller;

import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.launcher.listeners.TestExecutionSummary;
import org.junit.platform.launcher.listeners.TestExecutionSummary.Failure;
import org.junit.platform.engine.discovery.DiscoverySelectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "*")
public class TestExecutionController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> runTests() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Buscamos todas las clases de test bajo el paquete com.example.futmanager
            LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
                    .selectors(
                        DiscoverySelectors.selectClass("com.example.futmanager.service.CartaFUTServiceTest"),
                        DiscoverySelectors.selectClass("com.example.futmanager.service.EquipoServiceTest")
                    )
                    .build();

            Launcher launcher = LauncherFactory.create();
            SummaryGeneratingListener listener = new SummaryGeneratingListener();
            launcher.registerTestExecutionListeners(listener);
            launcher.execute(request);

            TestExecutionSummary summary = listener.getSummary();

            response.put("testsStartedCount", summary.getTestsStartedCount());
            response.put("testsSucceededCount", summary.getTestsSucceededCount());
            response.put("testsFailedCount", summary.getTestsFailedCount());
            response.put("testsSkippedCount", summary.getTestsSkippedCount());
            response.put("testsAbortedCount", summary.getTestsAbortedCount());
            response.put("totalTimeMs", summary.getTimeFinished() - summary.getTimeStarted());
            
            List<Map<String, Object>> failures = new ArrayList<>();
            for (Failure failure : summary.getFailures()) {
                Map<String, Object> failMap = new HashMap<>();
                failMap.put("testHeader", failure.getTestIdentifier().getDisplayName());
                failMap.put("className", failure.getTestIdentifier().getSource().isPresent() ? 
                        failure.getTestIdentifier().getSource().get().toString() : "Unknown");
                failMap.put("errorMessage", failure.getException().getMessage());
                failures.add(failMap);
            }
            response.put("failures", failures);
            response.put("status", summary.getTestsFailedCount() == 0 && summary.getTestsStartedCount() > 0 ? "SUCCESS" : "FAILURE");

        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error al ejecutar las pruebas programáticamente: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
