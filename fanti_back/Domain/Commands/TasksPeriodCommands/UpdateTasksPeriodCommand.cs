using Domain.Commands.Contracts;
using Domain.Enum;
using Domain.Validation;

namespace Domain.Commands
{

  public class UpdateTasksPeriodCommand : ValidatableTypes, ICommand
  {
    public UpdateTasksPeriodCommand(Guid id, Guid PeriodStaffId, int TaskNumber, int TaskHours, string? MainChallenge, string? LessonLearned,
      string? CodeReview, int? TaskRealHours, Guid? AproverId, CodeReview codeReviewStatus)
    {
      this.Id = id;
      this.PeriodStaffId = PeriodStaffId;
      this.TaskNumber = TaskNumber;
      this.TaskHours = TaskHours;
      this.MainChallenge = MainChallenge;
      this.LessonLearned = LessonLearned;
      this.CodeReview = CodeReview;
      this.TaskRealHours = TaskRealHours;
      this.AproverId = AproverId;
      this.codeReviewStatus = codeReviewStatus;
    }

    public Guid Id { get; set; }
    public Guid PeriodStaffId { get; set; }
    public int TaskNumber { get; set; }
    public int TaskHours { get; set; }
    public Guid ProjectId { get; set; }
    public string? MainChallenge { get; set; }
    public string? LessonLearned { get; set; }
    public string? CodeReview { get; set; }
    public int? TaskRealHours { get; set; }
    public Guid? AproverId { get; set; }
    public CodeReview codeReviewStatus { get; set; }


    public bool IsCommandValid()
    {
      ValidateGuidNotEmpty(Id, "Id");

      return this.isValid;
    }
  }
}