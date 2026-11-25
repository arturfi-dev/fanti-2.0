using Domain.Commands.Contracts;
using Domain.Validation;
using System.Collections.Generic;
using Domain.Entities;

namespace Domain.Commands
{

  public class CreatePeriodCommand : ValidatableTypes, ICommand
  {
    public CreatePeriodCommand(string Name, List<Guid> Staffs, DateTime StartDate, DateTime EndDate, string Objective)
    {
      this.StartDate = StartDate;
      this.EndDate = EndDate;
      this.Name = Name;
      this.Staffs = Staffs;
      this.Objective = Objective;

    }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Name { get; set; }
    public List<Guid> Staffs { get; set; }
    public string Objective { get; set; }


    public bool IsCommandValid()
    {
      return this.isValid;
    }
  }
}