# AI Workflow Comparison

## Overview

This assignment compares two different AI-assisted development workflows for building the same React settings form.

The first implementation used a very short and vague prompt:

> "Build a React settings form with a few basic fields."

The second implementation used a detailed specification including project structure, validation requirements, accessibility, verification steps, and implementation constraints.

## Comparison

### Correctness

The vague prompt produced a working settings form with basic input fields and clean styling. However, validation, verification, and accessibility requirements were missing.

The specification-driven prompt produced a more complete implementation with proper validation rules, reusable component structure, disabled save button until valid input, success feedback, and verification through linting and production build.

### Accessibility

The first version relied mostly on default HTML behavior.

The second version explicitly ensured visible labels, semantic HTML, keyboard accessibility, and better overall usability.

### Edge Cases

The vague implementation accepted almost any input without validation.

The specification-driven implementation handled empty required fields, invalid email addresses, maximum bio length, and prevented invalid form submission.

### Review Effort

The vague implementation required more manual inspection because many project requirements were unspecified.

The specification-driven implementation required significantly less review because the AI followed detailed constraints and verified the implementation by running lint and build checks.

## AI Mistake Found

During the first implementation, the AI generated a functional form but did not include validation or verification steps because they were never requested.

This demonstrated that AI generally follows the prompt instead of assuming project requirements.

## Lessons Learned

Providing precise requirements, implementation constraints, accessibility expectations, and verification steps produces more reliable code and reduces manual review effort. The specification-driven workflow generated higher-quality code while requiring fewer corrections afterward.